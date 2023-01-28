const router = require('express').Router()
const auth = require('../../modules/auth')
const lists = require('../../modules/array_sorting')
const avatars = Array.from({ length: 9 }, (_, i) => `./images/avatar_${i}.png`)
router.post('/', async (req, res) => {
	res.header('Content-Type', 'application/json')
	if (!auth.isOriginAllowed(req.get('origin')))
		return res
			.status(401)
			.send({
				valid: false,
				response: 'pokus o spuštění z neautorizovaného zdroje',
			})
	if (await auth.checkIfExists(req.body.username))
		return res
			.status(409)
			.send({ valid: false, response: 'Uživatel s tímto jménem již existuje' })

	let object = {
		user: {
			password: auth.createPassword(req.body.password),
			avatar: auth.GetRandomItem(avatars, false),
			verified: false,
			email: null,
			ID: await auth.getID(),
			admin: false,
			role: 'user',
			createdTimestamp: Math.floor(new Date().getTime() / 1000),
		},
		devices: [],
	}
	auth.setDB(req.body.username, object)
	auth.addID()
	res.status(201).send({ valid: true })
})
module.exports = router
