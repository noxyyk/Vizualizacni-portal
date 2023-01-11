const express = require('express');
const app = express();
const PORT = 5000;
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });