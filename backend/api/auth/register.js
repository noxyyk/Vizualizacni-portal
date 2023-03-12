const router = require('express').Router()
const db = require('../../modules/database')
const { checkIfExists, setResponseHeaders, createPassword, getID } = require('../../modules/auth')
const { GetRandomItem } = require('../../modules/array_sorting')
const avatars = Array.from({ length: 9 }, (_, i) => `./images/avatar_${i}.png`)
router.post('/', async (req, res) => {
	try {
		setResponseHeaders(req, res)
		const { username, password} = req.body
		if (await checkIfExists(username)) return res.status(409).send({ valid: false, response: 'Uživatel s tímto jménem již existuje' })

			if (!username || !password) return res.status(400).send({ valid: false, response: 'Nebylo zadáno jméno nebo heslo' })
			if (username.match(/[^a-zA-Z0-9]/g) || username.length < 4) return res.status(400).send({ valid: false, response: 'Jméno musí obsahovat alespoň 4 znaky a může obsahovat pouze písmena a čísla' })
			if (!password.match(/[a-z]/g)) return res.status(400).send({ valid: false, response: 'Heslo musí obsahovat alespoň jedno malé písmeno' })
			if (!password.match(/[A-Z]/g)) return res.status(400).send({ valid: false, response: 'Heslo musí obsahovat alespoň jedno velké písmeno' })
			if (!password.match(/\d/g)) return res.status(400).send({ valid: false, response: 'Heslo musí obsahovat alespoň jedno číslo' })
			if (password == username) return res.status(400).send({ valid: false, response: 'Heslo nesmí být stejné jako jméno' })
			if (!password.match(/^.{8,}$/g)) return res.status(400).send({ valid: false, response: 'Heslo musí obsahovat alespoň 8 znaků' })

	let object = {
		user: {
			password: await createPassword(password),
			avatar: GetRandomItem(avatars, false),
			verified: false,
			email: null,
			ID: await getID(),
			admin: false,
			role: 'user',
			createdTimestamp: Math.floor(new Date().getTime() / 1000),
		},
		devices: [],
	}
	await db.set(username, object)
	await db.add('ID', 1)
	res.status(201).send({ valid: true })
}
catch (err) {return res.status(err.statusCode).send({ valid: false, response: err.message })}
})
module.exports = router
