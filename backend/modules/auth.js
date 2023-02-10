let { DB } = require('mongquick')
const db = new DB(process.env.MongoLogin)
const bcrypt = require('bcryptjs')
const PORT = 5000
const jwt = require('jsonwebtoken')
const originsAllowed = [
	'http://localhost:' + PORT,
	'https://vizualizacni-portal.up.railway.app',
	'https://vizualizacni-portal.noxyyk.com',
	'https://api.vizualizacni-portal.noxyyk.com',
	'https://vizualizacni-portal-production.up.railway.app/',
	'https://noxyyk.com',
]
module.exports = {
	authenticateUser: async function (username, password) {
		//auth.authenticateUser('username', 'password');
		return bcrypt.compareSync(password, (await db.get(username)).user.password)
	},
	checkIfExists: async function (x) {
		//auth.checkifExists('username');
		if(x == undefined) return false
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
	getUser: async function (username) {
		//auth.getUser('username');
		return await db.get(username)
	},
	createToken: function (username, user, stayLogged) {
		//auth.createToken('username', 'user', 'stayLogged');
		stayLogged = stayLogged == undefined ? true : stayLogged
		return jwt.sign(
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
		return bcrypt.hashSync(password, 10)
	},
	authenticatePassword: async function (password, hash) {
		//auth.authenticatePassword('password', 'hash');
		return bcrypt.compareSync(password, hash)
	},
	getDBall: async function () {
		//auth.getDBall();
		return await db.all()
	},
	originsAllowed: originsAllowed,
}
