const router = require('express').Router()
const auth = require('../../modules/auth')
router.post('/', async (req, res) => {
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
	object.admin = req.body.role == 'admin' ? true : alse
	object.role = req.body.role
	var result = (await auth.getDBall()).filter(
		(key) => key.data.user?.admin == true
	)
	if (result.length == 1 && req.body.username == result[0].ID)
		return res.status(409).send({
			valid: false,
			response: 'Nelze odebrat admin práva poslednímu adminovi',
		})
	auth.setDB(req.body.username, { user: object })
	res.status(200).send({ valid: true })
})
module.exports = router
