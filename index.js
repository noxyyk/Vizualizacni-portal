const express = require("express")
const app = express()
const PORT = 3000
const bodyParser = require('body-parser');
const cors = require('cors');
var path = require('path');
fetch = import("node-fetch");
const Database = require("easy-json-database")
const db = new Database('./url.json')
const users = new Database('./users.json')
require('dotenv').config();
originsAllowed = ['http://localhost:' + PORT, 'https://url-shortener-frontend.vercel.app']
console.log(originsAllowed)
var avatars = [];
for (var i = 0; i < 9; i++) {
  avatars.push(`./images/avatar_${i}.png`);
}
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));
const ignoredlinks = [  "/", "error", "", ]

//url shortener in the link 
// app.get("/:id", async (req, res) => {
//   let id = req.params.id;
//   if (!db.has(id)) {
//     return
// }
// var obj = db.get(id);
// if (obj.usage.count >= obj.usage.max) {
//   db.delete(id);
//   return res.redirect("/error");
// }

// if (obj.usage.expired < Math.floor(new Date().getTime() / 1000)) {
//   db.delete(id);
//   return res.redirect("/error");
// }
// obj.usage.count++;
// db.set(id, obj);
// let url = db.get(id);
//   if (url) {
//     res.redirect(url.link);
//   }
// });

//set the url in the database
app.post("/set", async (req, res) => {
  let id = req.body.id;
  let url = req.body.url;
  let author = req.body.author;
  if (db.has(id)) return res.send("id already exists");
  if (!url.startsWith("http://")) return res.send("invalid url");
  if (ignoredlinks.includes(id.toLowerCase())) return res.send("invalid id");
  var data = {
    link: url,
    author: author,
    usage: {
      count: 0,
      max: users.has(req.body.author) ? users.get(req.body.author).usage.max : 50,
      created: Math.floor(new Date().getTime() / 1000),
      daysvalid:  users.has(req.body.author) ? users.get(req.body.author).usage.daysvalid : 7,
    }
  }
  db.set(id, data);
  res.send("ok");
});


var server = app.listen(PORT, function() {  
  twirlTimer = null
  process.stdout.write("\r" + ((process.env.isDev ? "Development mode" + ", hosted on " + originsAllowed[0] : "Production mode" + ", hosted on " + originsAllowed[1] )+ + " Port: " + PORT + " Adress: " + server.address().address + "Family: " + server.address().family + "\n"));
});