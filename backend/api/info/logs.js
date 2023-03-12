const router = require('express').Router()
const {setResponseHeaders, verifyUser,getLogs} = require('../../modules/auth')
const db = require('../../modules/database')
router.get('/', async (req, res) => {
	try {
    //  
	  setResponseHeaders(req, res)
	//	const user = await verifyUser(req)
	//		if(!(await db.get(user)).user.admin) return res.status(401).send({ valid: false, response: 'Nemáte oprávnění' })
    const result = await getLogs()
	res.status(200).send({ valid: true, logs: result })
} catch (err) {return res.status(err.statusCode).send({ valid: false, response: err.message })}
})
module.exports = router
