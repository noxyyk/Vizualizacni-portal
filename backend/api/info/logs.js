const router = require('express').Router()
const {setResponseHeaders, verifyUser,getLogs} = require('../../modules/auth')
let db;
( async () => {
const dbInstance = await require('../../modules/database');
db = dbInstance
})()
router.get('/', async (req, res, next) => {
	try {
    //  
	  setResponseHeaders(req, res)
	const user = await verifyUser(req)
	if(!(await db.get(user)).user.admin) return res.status(401).send({ valid: false, response: 'Nemáte oprávnění' })
    const result = await getLogs()
	res.status(200).send({ valid: true, logs: result })
} catch (err) {next(err)}
})
module.exports = router
