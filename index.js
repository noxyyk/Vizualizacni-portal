//start the website
const express = require("express")
const app = express()
const PORT = 5000
const bodyParser = require('body-parser');
const cors = require('cors');
var path = require('path');
fetch = import("node-fetch");
// initialize database
const bcrypt = require("bcrypt");
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
      res.send({ status: 200, valid: true });
    } else {
      res.send({ status: 401, valid: false, user_exists: true, valid_password: false });
    }
  } else {
    res.send({ status: 404, valid: false, user_exists: false });
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
    res.send({ status: 201, valid: true, registered: true });
  } else {
    res.send({ status: 409,valid: false, user_exists: true});
  }
})


app.use(express.static(__dirname + "/public"));

app.listen(PORT);