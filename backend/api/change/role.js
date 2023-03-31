const router = require('express').Router()
const { setResponseHeaders, verifyUser, getDBall, addlog} = require('../../modules/auth')
let db;
( async () => {
const dbInstance = await require('../../modules/database');
db = dbInstance
})()
router.post('/', async (req, res) => {
	try {
		setResponseHeaders(req, res)
		const { username, role } = req.body
		const user = await verifyUser(req)
		const userObject = await db.get(user)
		if (!userObject.user.admin) return res.status(401).send({ valid: false, response: 'Nemáte oprávnění' })
		if (!await db.has(username)) return res.status(404).send({ valid: false, response: 'Uživatel neexistuje' })
	var object = await db.get(username)
	await addlog(user,userObject.user.ID,userObject.user.avatar, 'změnil roli pro', 'info', {target: username, targetid: object.user.ID, new: role, old: object.user.role} );
	object.user.admin = role == 'admin' ? true : false
	object.user.role = role
	var result = (await getDBall()).filter(
		(key) => key.data.user?.admin == true
	)
	if (result.length == 1 && username == result[0].ID)
		return res.status(409).send({
			valid: false,
			response: 'Nelze odebrat admin práva poslednímu adminovi',
		})
	await db.set(username, object)
	res.status(200).send({ valid: true })
}
catch (err) {console.log(err);
	return res.status(err.statusCode||500).send({ valid: false, response: err.message||"nastala chyba" })}
})
module.exports = router