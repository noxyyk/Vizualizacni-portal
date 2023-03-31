const router = require('express').Router()
const {setResponseHeaders, verifyUser,getDBall} = require('../../modules/auth')
let db;
( async () => {
const dbInstance = await require('../../modules/database');
db = dbInstance
})()
router.get('/', async (req, res) => {
	try {
        setResponseHeaders(req, res)
		const user = await verifyUser(req)
		if(!(await db.get(user)).user.admin) return res.status(401).send({ valid: false, response: 'Nemáte oprávnění' })
		const result = (await db.all()).filter(
		(key) => key.value.user != undefined
	)
//for each user remove value.devices, and value.user.password
result.forEach((key) => {
	key.value.user.password = undefined
	key.value.devices = undefined
	key.value.email = undefined
})

	res.status(200).send({ valid: true, users: result })
} catch (err) {return res.status(err.statusCode||500).send({ valid: false, response: err.message||"chyba serveru" })}
})
module.exports = router
