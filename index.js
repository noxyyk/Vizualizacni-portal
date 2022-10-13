//start the website
const express = require("express")
const app = express()
const PORT = 5000
const bodyParser = require('body-parser');
const cors = require('cors');
var path = require('path');
fetch = import("node-fetch");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var logintest = {name:"Noxyyk", password:"Noxyyk"};

/* REQUESTS*/
app.post('/login', async function(req, res) {
    res.header("Content-Type", 'application/json');   
    if(logintest.name == req.headers.username && req.headers.password == logintest.password){ //check if name and password exists
      res.send({valid: true}); //return a valid credencials 
    }else{
    res.send({valid: false});//return an invalid credencials 
  }
  })

app.use(express.static(__dirname + "/public"));

app.listen(process.env.PORT || PORT);
