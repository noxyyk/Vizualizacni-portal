const router = require('express').Router()
const {setResponseHeaders, authenticateUser, handleError, verifyUser} = require('../../modules/auth')
const db = require('../../modules/database')

router.post('/', async (req, res) => {
	try {
		setResponseHeaders(req, res)
		const user = await verifyUser(req)
		await authenticateUser(user, req.body.password)
		await db.delete(user)
		res.status(200).send({ valid: true })
}
catch (err) {return res.status(err.statusCode).send({ valid: false, response: err.message })}
})

module.exports = router
