console.clear();
process.stdout.write("\r" + "Starting server...");
//start the website
const express = require("express")
const app = express()
const PORT = 5000
const bodyParser = require('body-parser');
const cors = require('cors');
var path = require('path');
fetch = import("node-fetch");
var package= require('./package.json');
// initialize database
const bcrypt = require("bcryptjs");
let { DB } = require("mongquick");
require('dotenv').config();
const db = new DB(process.env.MongoLogin);
// Security
const jwt = require('jsonwebtoken');
const { defaultMaxListeners } = require("events");

const avatars = ['https://i.imgur.com/2CXjyN6.png', 'https://i.imgur.com/7bwnZht.png', 'https://i.imgur.com/UmwVaRU.png', 'https://i.imgur.com/ZJT5vOm.png'];
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const originsAllowed = [
  "http://localhost:"+PORT,
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
  return jwt.sign({iss: username,avatar: user.user.avatar,email:user.user.email,verified: user.user.verified,admin: user.user.admin,role: user.user.role, ID: user.user.ID,createdTimestamp: user.user.createdTimestamp, exp: Math.floor(Date.now() / 1000) + (14 * 86400) 
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
      
    res.status(200).send({valid: true, pfp: object.user.avatar, token: token, admin: object.user.admin, role: object.user.role, ID: object.user.ID, createdTimestamp: object.user.createdTimestamp});
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
        "role": "user",
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
      jwt.verify(req.body.token, process.env.JWTSECRET, async function(err, decoded) {
        if (decoded.iss == "Noxyyk" && process.env.isDev) return res.status(200).send({valid: true, pfp: "https://avatars.githubusercontent.com/u/79714899?v=4", token: req.body.token, admin: true, role: "admin", ID: "702000000000000000", createdTimestamp: 0});//temp admin for testing
        if (err) return res.status(401).send({valid: false, response: err})
        if (decoded == undefined) return res.status(500).send({valid: false, response: "Nastala chyba, zkuste to znovu později"})
        var object = (await (db.get(decoded.iss))).user;
        for (var j in object) {
            d = decoded[String(j)]
            o = object[String(j)] 
            if ((o == undefined || d == undefined) || (o == d )) continue;
            console.log(decoded.iss,j, "( database: ", o,", ","token: ", d, ")" )
            return res.status(401).send({valid: false, response: "Nastala chyba, přihlašte se znovu"})}
    
        res.status(200).send({valid: true,role: decoded.role, email:decoded.email, verified:decoded.verified, pfp: decoded.avatar, user: decoded.iss, role: decoded.role, admin: decoded.admin, ID: decoded.ID, createdTimestamp: decoded.createdTimestamp});
      }); 
      });

      app.get('/userlist', async function(req, res) {
        res.header("Content-Type", 'application/json');
        var result = (await db.all()).filter(key => key.data.user != undefined);
        res.status(200).send({valid: true, users: result});
      })

      app.post('/role', async function(req, res) {
        res.header("Content-Type", 'application/json');
        if (!originsAllowed.includes(req.get('origin'))) return res.status(401).send({valid: false, response: "pokus o spuštění z neautorizovaného zdroje"})
        if (!(await (db.has(req.body.username)))) return res.status(409).send({valid: false, response: "Uživatel nexistuje"});
        var object = (await (db.get(req.body.username))).user;
        req.body.role == "admin" ? object.admin = true : object.admin = false
        object.role = req.body.role;
        var result = (await db.all()).filter(key => key.data.user?.admin == true);
        if (result.length == 1 && req.body.username == result[0].ID) return res.status(409).send({valid: false, response: "Nelze odebrat admin práva poslednímu adminovi"});
        db.set(req.body.username, {user: object});
        res.status(200).send({valid: true});
      })
app.use(express.static(__dirname + "/public"));

var server = app.listen(PORT, function() {  
  twirlTimer = null
  process.stdout.write("\r" + ((process.env.isDev ? "Development mode" + ", hosted on " + originsAllowed[0] : "Production mode" + ", hosted on " + originsAllowed[1] )+ " version: " + package.version + " Port: " + PORT + " Adress: " + server.address().address + "Family: " + server.address().family + "\n"));
});