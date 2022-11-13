//start the website
const express = require("express")
const app = express()
const PORT = 5000
const bodyParser = require('body-parser');
const cors = require('cors');
var path = require('path');
fetch = import("node-fetch");
// initialize database
const mongquick = require("mongquick");
let { DB } = require("mongquick");
const db = new DB('mongodb+srv://Noxyyk:T4ir4t3xi3@rguis.zkcth.mongodb.net/uiotv?retryWrites=true&w=majority'/*process.env.MongoLogin*/);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* REQUESTS*/
app.post('/login', async function(req, res) {
    res.header("Content-Type", 'application/json');   

    if(await (db.has(req.body.username))){ //check if name exists in database
      if (req.body.password == (await (db.get(req.body.username)))) { //check if password matches db
      res.send({valid: true});
    }else{
      res.send({valid: false, user_exists: true, valid_password: false});
    }
    }else{
      res.send({valid: false, user_exists: false});
    }
  })

  app.post('/register', async function(req, res) {
    res.header("Content-Type", 'application/json');  
    
    if (!(await (db.has(req.body.username)))){ //check if name doesn´t exists in the database
        db.set(req.body.username, req.body.password);
      res.send({valid: true, registered: true});
  }else{
    res.send({valid: false, user_exists: true});
  }
  })
app.use(express.static(__dirname + "/public"));

app.listen(PORT);