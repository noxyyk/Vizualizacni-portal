const router = require('express').Router()
const auth = require('../../modules/auth')

router.post('/', async (req, res) => {
	res.header('Content-Type', 'application/json')
	if (!auth.isOriginAllowed(req.get('origin')))
		return res.status(401).send({
			valid: false,
			response: 'pokus o spuštění z neautorizovaného zdroje',
		})
	if (!(await auth.checkIfExists(req.body.username)))
		return res
			.status(409)
			.send({ valid: false, response: 'Uživatel s tímto jménem nexistuje' })
	if (auth.authenticateUser(req.body.username, req.body.password))
		return res
			.status(401)
			.send({ valid: false, response: 'Heslo se neshhoduje' })

	var object = await auth.getUser(req.body.username)
	var token = auth.createToken(req.body.username, object, req.body.stayLogged)
	if (token == undefined)
		return res.status(500).send({
			valid: false,
			response: 'Nastala chyba, zkuste to znovu později',
		})
	object.user.loggedTimestamp = Math.floor(new Date().getTime() / 1000)
	auth.setUser(req.body.username, object)
	res.status(200).send({
		valid: true,
		pfp: object.user.avatar,
		token: token,
		admin: object.user.admin,
		role: object.user.role,
		ID: object.user.ID,
		createdTimestamp: object.user.createdTimestamp,
	})
})
module.exports = router
