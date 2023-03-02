const router = require('express').Router()
const auth = require('../../modules/auth')
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
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
		user = (await auth.verifyToken(req.headers.token)).iss
        if (!(await auth.checkIfExists(user)))
            return res
                .status(409)
                .send({ valid: false, response: 'Uživatel s tímto jménem nexistuje' })
	var object = await db.get(user)
	switch (req.body.type) {
	case 'password':
		if (req.body.password == req.body.password_old)
			return res.status(401).send({
				valid: false,
				response: 'zvolené heslo je stejné jako předtím',
			})
		if (req.body.password == user)
			return res.status(401).send({
				valid: false,
				response: 'zvolené heslo nesmí být stejné jako uživatelské jméno',
			})
			console.log(req.body.password_old, object.user.password)
		if (! await auth.authenticatePassword(req.body.password_old, object.user.password)) return res.status(401).send({ valid: false, response: 'původní heslo není správné' })
		object.user.password = await auth.createPassword(req.body.password)
		db.set(user, object)
		break
	case 'name':
		if (!(await auth.checkIfExists(user)))
			return res
				.status(404)
				.send({ valid: false, response: 'Uživatel neexistuje' })
		if (await auth.checkIfExists(req.body.username_new))
			return res.status(409).send({
				valid: false,
				response: 'Uživatel s tímto jménem již existuje',
			})
			db.set(req.body.username_new, object)
			db.delete(user)
		user = req.body.username_new
		break
	case 'check':
		res.status(200).send({ valid: true })
		break
	case 'avatar':
		object.user.avatar = req.body.avatar
		db.set(user, object)
		break
	default:
		res.status(400).send({ valid: false, response: 'neznámý typ' })
	}
	await delay(1000)
	res
		.status(200)
		.send({ valid: true, token: auth.createToken(user, object)})
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
