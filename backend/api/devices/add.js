const router = require('express').Router()
const {setResponseHeaders, verifyUser} = require('../../modules/auth')
let db;
( async () => {
const dbInstance = await require('../../modules/database');
db = dbInstance
})()

router.post('/', async (req, res, next) => {
    try {
        setResponseHeaders(req, res)
		const user = await verifyUser(req)
        if (req.body.device == undefined || typeof req.body.device != 'string' ||req.body.device.match(/^[a-zA-Z0-9]+$/) == null) return res.status(401).send({ valid: false, response: 'Název zařízení je neplatný' })
let object = await db.get(user)
let role = object.user.role 
if(!Array.isArray(object.devices)) object.devices = []
const maxDevices = object.user.admin ? 10 : role == 'advanced' ? 5 : 3
if (object.devices.length >= maxDevices) return res.status(401).send({ valid: false, response: 'Překročen limit zařízení, navyšte si plán' })
object.devices.push({name: req.body.device, createdTimestamp: Math.floor(Date.now() / 1000), data: []})
await db.set(user, object)
res.status(200).send({
    valid: true,
    devices: object.devices
})
    }
    catch (err) {next(err)}
})
module.exports = router