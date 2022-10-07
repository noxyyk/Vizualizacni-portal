//start the website
const express = require("express")
const app = express()
var logintest = {name:"Noxyyk", password:"Noxyyk"};

/* REQUESTS*/
app.get('/login', async function(req, res) {
    res.header("Content-Type", 'application/json');   
    if(logintest.name == req.headers.username){ //check if name exists
      if (req.headers.password == logintest.password) { //check if password matches db
      res.send({valid: true}); //return a valid credencials 
        var user = req.headers.username
        return
  
    }
    }
    res.send({valid: false});//return an invalid credencials 
  })

app.use(express.static(__dirname + "/public"));
const PORT = 5000
app.listen(process.env.PORT || PORT);
