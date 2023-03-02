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
		user = (await auth.verifyToken(req.headers.token)).iss
        if ((!(await auth.checkIfExists(user))) || !(await db.get(user)).user.admin )
            return res
                .status(409)
                .send({ valid: false, response: 'neoprávněné' })
	if (!(await auth.checkIfExists(req.body.username)))
		return res
			.status(409)
			.send({ valid: false, response: 'Uživatel nexistuje' })
	var object = await db.get(req.body.username)
	object.user.admin = req.body.role == 'admin' ? true : false
	object.user.role = req.body.role
	var result = (await auth.getDBall()).filter(
		(key) => key.data.user?.admin == true
	)
	if (result.length == 1 && req.body.username == result[0].ID)
		return res.status(409).send({
			valid: false,
			response: 'Nelze odebrat admin práva poslednímu adminovi',
		})
	await db.set(req.body.username, object)
	res.status(200).send({ valid: true })
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
