console.clear();
process.stdout.write("\r" + "Starting server...");
//start the website
const express = require("express");
const app = express();
const PORT = 5000;
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require("bcryptjs");
let { DB } = require("mongquick");
const db = new DB(process.env.MongoLogin);
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const originsAllowed = [
    "http://localhost:"+PORT,
    "https://vizualizacni-portal.up.railway.app",
    "vizualizacni-portal.noxyyk.com",
    "noxyyk.com",
  ];

const avatars = Array.from({ length: 9 }, (_, i) => `./images/avatar_${i}.png`);

let package= require('../package.json');
let package_ignore = ["scripts", "devDependencies", "main", "restart"];
  Object.keys(package).forEach(async (key) => {
    if (package_ignore.includes(key)) {
      delete package[key];
    }
});
/*FUNCTIONS*/
function listsGetRandomItem(list, remove) {
    if (list.length < 1) return undefined;
    var x = Math.floor(Math.random() * list.length);
    if (remove) {
      return list.splice(x, 1)[0];
    } else {
      return list[x];
    }
  }
function createToken(username,user, stayLogged) {
    stayLogged = stayLogged == undefined ? true : stayLogged
    return jwt.sign({iss: username,avatar: user.user.avatar,email:user.user.email,verified: user.user.verified,admin: user.user.admin,role: user.user.role, ID: user.user.ID,createdTimestamp: user.user.createdTimestamp, exp: Math.floor(Date.now() / 1000) + ((stayLogged? 14 : 1 )* 86400) 
  }, process.env.JWTSECRET , { algorithm: 'HS256' })
}
// app.use(function(req, res, next) { 
//     if (req.headers.host === 'api.vizualizacni-portal.noxyyk.com') {
//       res.redirect(301, 'https://vizualizacni-portal.noxyyk.com');
//     } else {
//       next();
//     }
//   });
// Routes
app.post('/login', async function(req, res) {
    res.header("Content-Type", 'application/json');
    if (!originsAllowed.includes(req.get('origin'))) return res.status(401).send({valid: false, response: "pokus o spuštění z neautorizovaného zdroje"})
    if (!(await (db.has(req.body.username)))) return res.status(404).send({valid: false, response: "Uživatel s tímto jménem neexistuje"})
    if (!(bcrypt.compareSync(req.body.password, (await (db.get(req.body.username))).user.password))) return res.status(401).send({valid: false, response: "Heslo se neshhoduje"});
  
    var object = await (db.get(req.body.username))
    var token = createToken(req.body.username, object, req.body.stayLogged)
    if (token == 'undefined') return res.status(500).send({valid: false, response: "Nastala chyba, zkuste to znovu později"})
        object.user.loggedTimestamp = (Math.floor(new Date().getTime() / 1000));
        db.set(req.body.username, object);
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
   if (!await (db.has(req.body.username))) return res.status(404).send({valid: false, response: "Uživatel neexistuje"});
   var object = await (db.get(req.body.username)); 
    switch (req.body.type) {
      case 'password':
        if (bcrypt.compareSync(req.body.password, object.user.password)) return res.status(401).send({valid: false, response: "zvolené heslo je stejné jako předtím"});
        if (req.body.password == req.body.username) return res.status(401).send({valid: false, response: "zvolené heslo nesmí být stejné jako uživatelské jméno"});
        object.user.password = (bcrypt.hashSync(req.body.password, 10));
        db.set(req.body.username, object);
      break;
      case 'name':
        if (!(await (db.has(req.body.username)))) return res.status(404).send({valid: false, response: "Uživatel neexistuje"});
        if (await (db.has(req.body.username_new))) return res.status(409).send({valid: false, response: "Uživatel s tímto jménem již existuje"});
        db.set(req.body.username_new, object);
        db.delete(req.body.username);
        req.body.username = req.body.username_new;
       break;
       case 'check':
        res.status(200).send({valid: true});
        break;
        case 'avatar':
          object.user.avatar = req.body.avatar;
          db.set(req.body.username, object);
          break;
       default:
        res.status(400).send({valid: false, response: "neznámý typ"});
      }
      delay(1000).then(() => {
      res.status(200).send({valid: true, token: createToken(req.body.username, object)});
      })
})
  
app.post('/delete', async function(req, res) {//delete user
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
          if (err) return res.status(401).send({valid: false, response: err})
          if (decoded == undefined) return res.status(500).send({valid: false, response: "Nastala chyba, zkuste to znovu později"})
          if (!await (db.has(decoded.iss))) return res.status(409).send({valid: false, response: "uživatel neexistuje"});
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
app.get('/footer', async function(req, res) {
          res.header("Content-Type", 'application/json');
          res.status(200).send({valid: true, footer: package});
})
var server = app.listen(PORT, function() {  
    process.stdout.write("\r" + ((process.env.isDev ? "Development mode" + ", hosted on " + originsAllowed[0] : "Production mode" + ", hosted on " + originsAllowed[1] )+ " version: " + package.version + " Port: " + PORT + " Adress: " + server.address().address + "Family: " + server.address().family + "\n"));
  });