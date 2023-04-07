const router = require('express').Router()
const {setResponseHeaders, verifyUser} = require('../../modules/auth')
let db;
( async () => {
const dbInstance = await require('../../modules/database');
db = dbInstance
})()

router.get('/', async (req, res, next) => {
    try {
        setResponseHeaders(req, res)
		const user = await verifyUser(req)
let object = await db.get(user)
var devices = object.devices
if (devices == undefined) devices = []
devices.secrets == undefined
res.status(200).send({
    valid: true,
    devices: devices
})
    }
    catch (err) {next(err)}
})
module.exports = router