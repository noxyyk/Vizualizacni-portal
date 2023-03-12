require('dotenv').config()
const db = require('./database.js')
db.on("ready", () => {
    console.log("Database connected!");
});
const bcrypt = require('bcryptjs')
const PORT = 5001
const jwt = require('jsonwebtoken')
const originsAllowed = [
	'http://localhost:5000',
	'https://vizualizacni-portal.noxyyk.com',
	'https://noxyyk.com',
	'http://127.0.0.1:5500',
	'http://127.0.0.1:8080',
	'http://192.168.1.129:8081'
]
const fs = require('fs');
const maxLogs = 20;
module.exports = {
	authenticateUser: async function (username, password) {
		//auth.authenticateUser('username', 'password')
		const isString = (value) => typeof value === 'string'
		if (!isString(username) || !isString(password) || !(await db.has(username))) throw { statusCode: 409, message: 'Jméno nebo heslo je špatně' }
		if (!(bcrypt.compareSync(password, (await db.get(username)).user.password))) throw { statusCode: 401, message: 'jméno nebo heslo je špatně' }
	},
	checkIfExists: async function (x) {
		//auth.checkifExists('username');
		if(x == undefined ) return false
		return await db.has(x)	
	},
	isOriginAllowed: function (origin) {
		//auth.isOriginAllowed('origin');
		return originsAllowed.includes(origin)
	},
	deleteUser: async function (username) {
		//auth.deleteUser('username');
		db.delete(username)
	},
	verifyUser: async function (req) {
		let token = req.headers.authorization?.split(" ")[1]
		if (!token || typeof token != "string") throw { statusCode: 409, message: 'Uživatel nexistuje' }
		const user = (await new Promise((resolve, reject) => {
			jwt.verify(
			  token,
			  process.env.JWTSECRET,
			  async function (err, decoded) {
				if (err || decoded == undefined || !(await db.has(decoded.iss))) {
				  reject(err);
				}
				  if (decoded.exp < Math.floor(Date.now() / 1000)) {reject('Token expiroval');}
				  resolve(decoded);
			  }
			);
		  })).iss;
		if (!user) throw { statusCode: 409, message: 'Uživatel nexistuje' }
		return user
	},
	createToken: function (username, user, stayLogged) {
		//auth.createToken('username', 'user', 'stayLogged');
		stayLogged = stayLogged == undefined ? true : stayLogged
		let token = jwt.sign(
			{
				iss: username,
				avatar: user.user.avatar,
				email: user.user.email,
				verified: user.user.verified,
				admin: user.user.admin,
				role: user.user.role,
				ID: user.user.ID,
				createdTimestamp: user.user.createdTimestamp,
				exp: Math.floor(Date.now() / 1000) + (stayLogged ? 14 : 1) * 86400,
			},
			process.env.JWTSECRET,
			{ algorithm: 'HS256' }
		)
		if (token == undefined) throw { statusCode: 500, message: 'Nastala chyba, zkuste to znovu později' }
		return token
	},
	setUser: async function (username, object) {
		//auth.setUser('username', 'object');
		db.set(username, object)
	},
	addID: async function addID() {
		//auth.addID();
		db.add('ID', 1)
	},
	getID: async function () {
		//auth.getID();
		return await db.get('ID')
	},
	setDB: async function (x, y) {
		//auth.setDB('username', 'password');
		db.set(x, y)
	},
	createPassword: async function (password) {
		//auth.createPassword('password');
		return bcrypt.hashSync(password, Number(process.env.SALT))
	},
	authenticatePassword: async function (password, hash) {
		//auth.authenticatePassword('password', 'hash');
		if (password == undefined || hash == undefined) return false
		return bcrypt.compareSync(password, hash)
	},
	getDBall: async function () {
		//auth.getDBall();
		return await db.all()
	},
	originsAllowed: originsAllowed,
	addlog: async function (user,id,avatar, type, icon, data) {
		//check if file 
		if (!fs.existsSync('logs.json')) {
		fs.writeFileSync('logs.json', '[]');								
		}
		let logs = JSON.parse(fs.readFileSync('logs.json'));
		//add a new log at FIRST position
		logs.unshift({ user: user, id: id,avatar:avatar, type: type, icon: icon, data: data, timestamp: Date.now()});
		if (logs.length > maxLogs) {
		  logs.pop();
		}
		fs.writeFileSync('logs.json', JSON.stringify(logs));
	  },
	getLogs: async function () {
		return JSON.parse(fs.readFileSync('logs.json'));
		},
	setResponseHeaders: function (req, res) {
			res.header('Content-Type', 'application/json')
			if (!originsAllowed.includes(req.get('origin'))) {
				throw {
				  statusCode: 401,
				  message: 'pokus o spuštění z neautorizovaného zdroje',
				  valid: false,
				  response: 'pokus o spuštění z neautorizovaného zdroje',
				}
			}
			res.header('Access-Control-Allow-Origin', req.get('origin'))
		  },
	handleError: function(res, err) {
		throw { statusCode: 500, message: 'Nastala chyba, zkuste to znovu', valid: false, response: 'Nastala chyba'}
		  },								
}
