console.clear();
process.stdout.write("\r" + "Starting server...");
//start the website
const express = require("express");
const app = express();
const PORT = 5000;
const bodyParser = require('body-parser');
const cors = require('cors');
const auth = require('./modules/auth');
const package = require('./package.json');
if (process.env.NODE_ENV !== 'development') require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add Access-Control-Allow-Origin header
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.get('origin'));
  next();
});
app.use('/api', require('./api/routes.js').default);

var server = app.listen(PORT, function() {  
   // process.stdout.write("\r" + ((process.env.NODE_ENV == "development" ? "Development mode" + ", hosted on " + auth.originsAllowed[0] : "Production mode" + ", hosted on " + auth.originsAllowed[1] )+ " version: " + package.version + " Port: " + PORT + " Adress: " + server.address().address + "Family: " + server.address().family + "\n"));
  });