const router = require('express').Router()
const {setResponseHeaders, authenticateUser, verifyUser} = require('../../modules/auth')
let db;
( async () => {
const dbInstance = await require('../../modules/database');
db = dbInstance
})()
router.post('/', async (req, res, next) => {
	try {
		setResponseHeaders(req, res);
		const user = await verifyUser(req);
		await authenticateUser(user, req.body.password);
		await db.delete(user);
		res.status(200).send({ valid: true });
	  } catch (err) {
		next(err);
	  }
	});

module.exports = router
