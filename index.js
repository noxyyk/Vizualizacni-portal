//start the website
const express = require("express")
const app = express()
const PORT = 5000
const bodyParser = require('body-parser');
const cors = require('cors');
var path = require('path');
fetch = import("node-fetch");
var package= require('./package.json');
console.log(package.version)
// initialize database
const bcrypt = require("bcryptjs");
let { DB } = require("mongquick");
require('dotenv').config();
const db = new DB(process.env.MongoLogin);
// Security
const jwt = require('jsonwebtoken');

const avatars = ['https://i.imgur.com/2CXjyN6.png', 'https://i.imgur.com/7bwnZht.png', 'https://i.imgur.com/UmwVaRU.png', 'https://i.imgur.com/ZJT5vOm.png'];
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const originsAllowed = [
  "http://localhost:5000",
  "https://vizualizacni-portal.up.railway.app",
]
/*FUNCTIONS*/
function listsGetRandomItem(list, remove) {
  var x = Math.floor(Math.random() * list.length);
  if (remove) {
    return list.splice(x, 1)[0];
  } else {
    return list[x];
  }
}
function createToken(username,user) {
  return jwt.sign({iss: username,avatar: user.user.avatar,admin: user.user.admin, exp: Math.floor(Date.now() / 1000) + (14 * 86400) 
}, process.env.JWTSECRET , { algorithm: 'HS256' })
}

// Routes
app.post('/login', async function(req, res) {
  res.header("Content-Type", 'application/json');
  if (!originsAllowed.includes(req.get('origin'))) return res.status(401).send({valid: false, response: "pokus o spuštění z neautorizovaného zdroje"})
  if (!(await (db.has(req.body.username)))) return res.status(404).send({valid: false, response: "Uživatel s tímto jménem neexistuje"})
  if (!(bcrypt.compareSync(req.body.password, (await (db.get(req.body.username))).user.password))) return res.status(401).send({valid: false, response: "Heslo se neshhoduje"});

  var object = await (db.get(req.body.username))
  var token = createToken(req.body.username,object)
  if (token == 'undefined') return res.status(500).send({valid: false, response: "Nastala chyba, zkuste to znovu později"})
      
    res.status(200).send({valid: true, pfp: object.user.avatar, token: token});
  });

app.post('/register', async function(req, res) {
  res.header("Content-Type", 'application/json');
  if (!originsAllowed.includes(req.get('origin'))) return res.status(401).send({valid: false, response: "pokus o spuštění z neautorizovaného zdroje"})
  if ((await (db.has(req.body.username)))) return res.status(409).send({valid: false, response: "Uživatel s tímto jménem již existuje"});
   
  object = {
      "user": {
        "password": (bcrypt.hashSync(req.body.password, 10)),
        "avatar": listsGetRandomItem(avatars, false),
        "verified": false,
        "email": null,
        "ID": (await (db.get('ID'))),
        "admin": false,
        "createdTimestamp": (Math.floor(new Date().getTime() / 1000))
      },
      "devices": []
    };
    db.set(req.body.username, object);
    db.add('ID', 1);
    res.status(201).send({valid: true});
})

app.post('/change', async function(req, res) {
  res.header("Content-Type", 'application/json');
  if (!originsAllowed.includes(req.get('origin'))) return res.status(401).send({valid: false, response: "pokus o spuštění z neautorizovaného zdroje"})
 if (await ((db.has(req.body.username)))) var object = await (db.get(req.body.username)); 
  switch (req.body.type) {
    case 'password':
      if (bcrypt.compareSync(req.body.password, object.user.password)) return res.status(401).send({valid: false, response: "zvolené heslo je stejné jako předtím"});
      if (req.body.password == req.body.username) return res.status(401).send({valid: false, response: "zvolené heslo nesmí být stejné jako uživatelské jméno"});
      object.user.password = (bcrypt.hashSync(req.body.password, 10));
      db.set(req.body.username, object);
            res.status(200).send({valid: true});
    break;
    case 'name':
      if (req.body.username == req.body.name) return res.status(401).send({valid: false, response: "zvolené jméno je stejné jako předtím"});
       if (await (db.has(req.body.name))) return res.status(401).send({valid: false, response: "uživatel s tímto jménem již existuje"});
      db.set(req.body.name, object);
      db.delete(req.body.username);
      res.status(200).send({valid: true});
     break;
     case 'check':
      if (await (!(db.has(req.body.username)))) return res.status(409).send({valid: false, response: "uživatel neexistuje"});
      res.status(200).send({valid: true});
     default:
      res.status(400).send({valid: false, response: "neznámý typ"});
    }
    })

app.post('/delete', async function(req, res) {
      res.header("Content-Type", 'application/json');
      if (!originsAllowed.includes(req.get('origin'))) return res.status(401).send({valid: false, response: "pokus o spuštění z neautorizovaného zdroje"})
      if (!(await (db.has(req.body.username)))) return res.status(409).send({valid: false, response: "Uživatel s tímto jménem nexistuje"});
      db.delete(req.body.username);
      res.status(200).send({valid: true});
    })
    app.post('/verify', async function(req, res) {
      res.header("Content-Type", 'application/json');
      if (!originsAllowed.includes(req.get('origin'))) return res.status(401).send({valid: false, response: "pokus o spuštění z neautorizovaného zdroje"})
      jwt.verify(req.body.token, process.env.JWTSECRET, function(err, decoded) {

        if (err) return res.status(401).send({valid: false, response: err})
        if (decoded == undefined) return res.status(500).send({valid: false, response: "Nastala chyba, zkuste to znovu později"})
          
        res.status(200).send({valid: true, pfp: decoded.avatar, user: decoded.iss});
      });

      });

app.use(express.static(__dirname + "/public"));

app.listen(PORT);