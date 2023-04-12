require('dotenv').config()
const bcrypt = require('bcryptjs')
const { originsAllowed } = require('../config').server
const logger = require('../logs/logger.js')
const jwt = require('jsonwebtoken')
const fs = require('fs');
const { maxLogs } = require('../config').modules
let db;
( async () => {
const dbInstance = await require('./database.js');
db = dbInstance
logger.log('info', 'Database connected')
})()

module.exports = {
	authenticateUser: async function (username, password) {
		const isString = (value) => typeof value === 'string';
		if (!isString(username) || !isString(password) || !(await db.has(username))) {
		  throw { statusCode: 409, message: 'Jméno nebo heslo je špatně' };
		}
		if (
		  !bcrypt.compareSync(
			password,
			(await db.get(username)).user.password
		  )
		) {
		  throw { statusCode: 401, message: 'jméno nebo heslo je špatně' };
		}
	  },
	checkIfExists: async function (x) {
		//auth.checkifExists('username');
		if(typeof x != "string" ) return false
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
		//if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ') || !req.headers.authorization.split(' ').length === 2) throw { statusCode: 409, message: 'Uživatel nexistuje' }
		let token = req.headers.authorization?.split(" ")[1]	
		if (!token || typeof token != "string") throw { statusCode: 409, message: 'Uživatel nexistuje' }
		const user = (await new Promise((resolve, reject) => {
			jwt.verify(
			  token,
			  process.env.JWTSECRET,
			  async function (err, decoded) {
				if (err || !decoded || !(await db.has(decoded.iss))) {
				  reject(err);
				}
				  if (decoded?.exp != undefined && decoded.exp < Math.floor(Date.now() / 1000)) {reject('Token expiroval');}
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
		return bcrypt.hashSync(password, Number(process.env.SALT))
	},
	authenticatePassword: async function (password, hash) {
		if (password == undefined || hash == undefined) return false
		return bcrypt.compareSync(password, hash)
	},
	getDBall: async function () {
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
