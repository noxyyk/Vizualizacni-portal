const router = require('express').Router()
const { setResponseHeaders,verifyUser,authenticatePassword,createPassword, createToken} = require('../../modules/auth')
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
let db;
( async () => {
const dbInstance = await require('../../modules/database');
db = dbInstance
})()

router.post('/', async (req, res, next) => {
	try {
	const {type, password_old, password, username_new} = req.body
	setResponseHeaders(req, res)
	let user = await verifyUser(req)
	var object = await db.get(user)
	switch (type) {
	case 'password':
		if (password == password_old)
			return res.status(401).send({
				valid: false,
				response: 'zvolené heslo je stejné jako předtím',
			})
		if (password == user)
			return res.status(401).send({
				valid: false,
				response: 'zvolené heslo nesmí být stejné jako uživatelské jméno',
			})
		if (! await authenticatePassword(password_old, object.user.password)) return res.status(401).send({ valid: false, response: 'původní heslo není správné' })
		object.user.password = await createPassword(password)
		await db.set(user, object)
		break
	case 'name':
		if (!(await db.has(user)))
			return res
				.status(404)
				.send({ valid: false, response: 'Uživatel neexistuje' })
		if (await db.has(username_new))
			return res.status(409).send({
				valid: false,
				response: 'Uživatel s tímto jménem již existuje',
			})
			await db.set(username_new, object)
			await db.delete(user)
		user = username_new
		break
	case 'check':
		res.status(200).send({ valid: true })
		break
	case 'avatar':
		object.user.avatar = req.body.avatar
		await db.set(user, object)
		break
	default:
		res.status(400).send({ valid: false, response: 'neznámý typ' })
	}
	await delay(1000)
	res
		.status(200)
		.send({ valid: true, token: createToken(user, object)})
	}
	catch (err) {next(err)}
})
module.exports = router