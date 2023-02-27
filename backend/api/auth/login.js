const router = require('express').Router()
const auth = require('../../modules/auth')
const db = require('../../modules/database')
router.post('/', async (req, res) => {
	try {
	res.header('Content-Type', 'application/json')
	if (!auth.isOriginAllowed(req.get('origin')))
		return res.status(401).send({
			valid: false,
			response: 'pokus o spuštění z neautorizovaného zdroje',
		})
	res.header('Access-Control-Allow-Origin', req.get('origin'))
	if (typeof req.body.username !== 'string' || typeof req.body.password !== 'string') return res.status(401).send({ valid: false, response: 'neplatné přihlášení' })
	if (!(await auth.authenticateUser(req.body.username, req.body.password))) {
		return res
			.status(409)
			.send({ valid: false, response: 'Jméno nebo heslo je špatně'})
	}
	var object = await db.get(req.body.username)
	var token = await auth.createToken(req.body.username, object, req.body.stayLogged)
	if (token == undefined)
		return res.status(500).send({
			valid: false,
			response: 'Nastala chyba, zkuste to znovu později',
		})
	object.user.loggedTimestamp = Math.floor(new Date().getTime() / 1000)
	db.set(req.body.username, object)
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
catch (err) {
	console.log(err)
	res.status(500).send({
		valid: false,
		response: 'Nastala chyba, ' + err
	})
}
})
module.exports = router
