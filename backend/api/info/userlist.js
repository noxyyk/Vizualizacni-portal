const router = require('express').Router()
const auth = require('../../modules/auth')
router.get('/', async (req, res) => {
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

	const result = (await auth.getDBall()).filter(
		(key) => key.data.user != undefined
	)
	res.status(200).send({ valid: true, users: result })
} catch (err) {
	console.log(err)
	res.status(500).send({
		valid: false,
		response: 'Nastala chyba, ' + err
	})
}
})
module.exports = router
