const router = require('express').Router()
const {setResponseHeaders, authenticateUser, createToken} = require('../../modules/auth')
let db;
( async () => {
const dbInstance = await require('../../modules/database');
db = dbInstance
})()
router.post('/', async (req, res, next) => {
	const { username, password, stayLogged } = req.body
	try {
	setResponseHeaders(req, res)
	await authenticateUser(username, password)
	var object = await db.get(username)
	var token = createToken(username, object, stayLogged)
	object.user.loggedTimestamp = Math.floor(new Date().getTime() / 1000)
	await db.set(username, object)
	res.status(200).send({
		valid: true,
		pfp: object.user.avatar,
		token: token,
		admin: object.user.admin,
		role: object.user.role,
		ID: object.user.ID,
		createdTimestamp: object.user.createdTimestamp,
	})
}
catch (err) {next(err)}
})
module.exports = router
