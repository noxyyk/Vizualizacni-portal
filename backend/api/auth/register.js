const router = require('express').Router()
const auth = require('../../modules/auth')
const array = require('../../modules/array_sorting')
let { DB } = require('mongquick')
const db = new DB(process.env.MongoLogin)
const avatars = Array.from({ length: 9 }, (_, i) => `./images/avatar_${i}.png`)
router.post('/', async (req, res) => {
	try {
	res.header('Content-Type', 'application/json')
	if (!auth.isOriginAllowed(req.get('origin')))
		return res
			.status(401)
			.send({
				valid: false,
				response: 'pokus o spuštění z neautorizovaného zdroje',
			})
	res.header('Access-Control-Allow-Origin', req.get('origin'))
	if (await auth.checkIfExists(req.body.username))
		return res
			.status(409)
			.send({ valid: false, response: 'Uživatel s tímto jménem již existuje' })

			if (!req.body.username || !req.body.password) return res.status(400).send({ valid: false, response: 'Nebylo zadáno jméno nebo heslo' })
			if (req.body.username.match(/[^a-zA-Z0-9]/g) || req.body.username.length < 4) return res.status(400).send({ valid: false, response: 'Jméno musí obsahovat alespoň 4 znaky a může obsahovat pouze písmena a čísla' })
			if (!req.body.password.match(/[a-z]/g)) return res.status(400).send({ valid: false, response: 'Heslo musí obsahovat alespoň jedno malé písmeno' })
			if (!req.body.password.match(/[A-Z]/g)) return res.status(400).send({ valid: false, response: 'Heslo musí obsahovat alespoň jedno velké písmeno' })
			if (!req.body.password.match(/\d/g)) return res.status(400).send({ valid: false, response: 'Heslo musí obsahovat alespoň jedno číslo' })
			if (req.body.password == req.body.username) return res.status(400).send({ valid: false, response: 'Heslo nesmí být stejné jako jméno' })
			if (!req.body.password.match(/^.{8,}$/g)) return res.status(400).send({ valid: false, response: 'Heslo musí obsahovat alespoň 8 znaků' })

	let object = {
		user: {
			password: auth.createPassword(req.body.password),
			avatar: array.GetRandomItem(avatars, false),
			verified: false,
			email: null,
			ID: await auth.getID(),
			admin: false,
			role: 'user',
			createdTimestamp: Math.floor(new Date().getTime() / 1000),
		},
		devices: [],
	}
	db.set(req.body.username, object)
	db.add('ID', 1)
	res.status(201).send({ valid: true })
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
