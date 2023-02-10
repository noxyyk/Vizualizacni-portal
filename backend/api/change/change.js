const router = require('express').Router()
const auth = require('../../modules/auth')
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

router.post('/', async (req, res) => {
	try {
	res.header('Content-Type', 'application/json')
	if (!auth.isOriginAllowed(req.get('origin')))
		return res.status(401).send({
			valid: false,
			response: 'pokus o spuštění z neautorizovaného zdroje',
		})
		res.header('Access-Control-Allow-Origin', req.get('origin'))
	if (!(await auth.checkIfExists(req.body.username)))
		return res
			.status(409)
			.send({ valid: false, response: 'Uživatel nexistuje' })
	var object = await auth.getUser(req.body.username)
	switch (req.body.type) {
	case 'password':
		if (auth.authenticatePassword(req.body.password, object.user.password))
			return res.status(401).send({
				valid: false,
				response: 'zvolené heslo je stejné jako předtím',
			})
		if (req.body.password == req.body.username)
			return res.status(401).send({
				valid: false,
				response: 'zvolené heslo nesmí být stejné jako uživatelské jméno',
			})
		object.user.password = auth.createPassword(req.body.password)
		auth.setDB(req.body.username, object)
		break
	case 'name':
		if (!(await auth.checkIfExists(req.body.username)))
			return res
				.status(404)
				.send({ valid: false, response: 'Uživatel neexistuje' })
		if (await auth.checkIfExists(req.body.username_new))
			return res.status(409).send({
				valid: false,
				response: 'Uživatel s tímto jménem již existuje',
			})
		auth.setDB(req.body.username_new, object)
		auth.deleteUser(req.body.username)
		req.body.username = req.body.username_new
		break
	case 'check':
		res.status(200).send({ valid: true })
		break
	case 'avatar':
		object.user.avatar = req.body.avatar
		auth.setDB(req.body.username, object)
		break
	default:
		res.status(400).send({ valid: false, response: 'neznámý typ' })
	}
	await delay(1000)
	res
		.status(200)
		.send({ valid: true, token: auth.createToken(req.body.username, object) })
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
