const router = require('express').Router()
const {setResponseHeaders, authenticateUser, createToken, handleError} = require('../../modules/auth')
const db = require('../../modules/database')
router.post('/', async (req, res) => {
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
catch (err) {return res.status(err.statusCode).send({ valid: false, response: err.message })}
})
module.exports = router
