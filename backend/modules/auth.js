let { DB } = require("mongquick")
const db = new DB(process.env.MongoLogin);
const bcrypt = require('bcryptjs');
const PORT = 5000;
const originsAllowed = [
    "http://localhost:"+PORT,
    "https://vizualizacni-portal.up.railway.app",
    "https://vizualizacni-portal.noxyyk.com",
    "https://noxyyk.com",
  ];

async function authenticateUser(username, password) {//auth.authenticateUser('username', 'password');
    return (bcrypt.compareSync(password, (await (db.get(username))).user.password))
}
async function authenticatePasswword(password, hash) {//auth.authenticatePassword('password', 'hash');
    return (bcrypt.compareSync(password, hash))
}
async function createPassword(password){//auth.createPassword('password');
    return bcrypt.hashSync(password, 10);
}
async function checkIfExists(x) {//auth.checkifExists('username');
    return (await (db.has(x)))
}
async function setDB(x, y) {//auth.setDB('username', 'password');
    db.set(x, y);
}
async function deleteUser(username) {//auth.deleteUser('username');
    db.delete(username);
}
function isOriginAllowed(origin) {//auth.isOriginAllowed('origin');
    return originsAllowed.includes(origin);
  }
async function getUser(username) {//auth.getUser('username');
    return await (db.get(username));
  }
async function setuUser(username, object){//auth.setUser('username', 'object');
    db.set(username, object);
}
async function addID() {//auth.addID();
    db.add('ID', 1);
}
async function getID() {//auth.getID();
    return await (db.get('ID'));
}
async function getDBall() {//auth.getDBall();
    return await (db.all());
}
function createToken(username, user, stayLogged) {//auth.createToken('username', 'user', 'stayLogged');
    stayLogged = stayLogged == undefined ? true : stayLogged
    return jwt.sign({iss: username,avatar: user.user.avatar,email:user.user.email,verified: user.user.verified,admin: user.user.admin,role: user.user.role, ID: user.user.ID,createdTimestamp: user.user.createdTimestamp, exp: Math.floor(Date.now() / 1000) + ((stayLogged? 14 : 1 )* 86400) 
  }, process.env.JWTSECRET , { algorithm: 'HS256' })
}
module.exports = {
  authenticateUser,
  checkIfExists,
    isOriginAllowed,
    deleteUser,
    getUser,
    createToken,
    setuUser,
    addID,
    getID,
    setDB,
    createPassword,
    authenticatePasswword,
    getDBall,
    originsAllowed
}