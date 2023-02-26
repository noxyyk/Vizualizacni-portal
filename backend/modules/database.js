const { DB } = require('mongquick');
const db = new DB(process.env.MongoLogin);
module.exports = db;