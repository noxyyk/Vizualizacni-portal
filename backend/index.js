console.clear();
process.stdout.write("\r" + "Starting server...");
//start the website
const express = require("express");
const app = express();
const PORT = 5000;
const bodyParser = require('body-parser');
const cors = require('cors');
if (process.env.NODE_ENV !== 'development') require('dotenv').config();

app.use(cors({
  origin: (origin, callback) => {
    if (auth.originsAllowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', require('./api/routes.js'));

var server = app.listen(PORT, function() {  
   process.stdout.write("\r" + ((process.env.NODE_ENV == "development" ? "Development mode" + ", hosted on " + auth.originsAllowed[0] : "Production mode" + ", hosted on " + auth.originsAllowed[1] )+ " version: " + package.version + " Port: " + PORT + " Adress: " + server.address().address + "Family: " + server.address().family + "\n"));
  });