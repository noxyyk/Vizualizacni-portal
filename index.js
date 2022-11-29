//start the website
const express = require("express")
const app = express()
const PORT = 5000
const bodyParser = require('body-parser');
const cors = require('cors');
var path = require('path');
fetch = import("node-fetch");
// initialize database
const bcrypt = require("bcryptjs");
let { DB } = require("mongquick");
const db = new DB('mongodb+srv://Noxyyk:T4ir4t3xi3@rguis.zkcth.mongodb.net/uiotv?retryWrites=true&w=majority'/*process.env.MongoLogin*/);

const avatars = ['https://i.imgur.com/2CXjyN6.png', 'https://i.imgur.com/7bwnZht.png', 'https://i.imgur.com/UmwVaRU.png', 'https://i.imgur.com/ZJT5vOm.png'];
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*FUNCTIONS*/
function listsGetRandomItem(list, remove) {
  var x = Math.floor(Math.random() * list.length);
  if (remove) {
    return list.splice(x, 1)[0];
  } else {
    return list[x];
  }
}
app.post('/login', async function(req, res) {
  res.header("Content-Type", 'application/json');
  if (await (db.has(req.body.username))) { //check if name exists in database
    if (bcrypt.compareSync(req.body.password, (((await (db.get(req.body.username)))[String('user')])[String('password')]))) {
      res.status(200).send({valid: true });
    } else {
      res.status(401).send({valid: false });
    }
  } else {
    res.status(404).send({valid: false});
  }
})

app.post('/register', async function(req, res) {
  res.header("Content-Type", 'application/json');
  if (!(await (db.has(req.body.username)))) { //check if name doesn´t exists in the database
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
  } else {
    res.status(409).send({valid: false});
  }
})

app.post('/change', async function(req, res) {
  res.header("Content-Type", 'application/json');
 if (await ((db.has(req.body.username)))) var object = await (db.get(req.body.username)); 
  switch (req.body.type) {
    case 'password':
      if (object.user.password == req.body.password || req.body.password == req.body.username) return res.status(401).send({valid: false});
      object.user.password = (bcrypt.hashSync(req.body.password, 10));
      db.set(req.body.username, object);
            res.status(200).send({valid: true});
    break;
    case 'name':
      if (req.body.username == req.body.name || (await (db.has(req.body.name)))) return res.status(401).send({valid: false});
      db.set(req.body.name, object);
      db.delete(req.body.username);
      res.status(200).send({valid: true});
     break;
     case 'check':
      if (await (!(db.has(req.body.username)))) return res.status(409).send({valid: false});
      res.status(200).send({valid: true});
     default:
      res.status(400).send({valid: false});
    }
    })
app.use(express.static(__dirname + "/public"));

app.listen(PORT);