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

	auth.deleteUser(req.body.username)
	res.status(200).send({ valid: true })
})

module.exports = router
