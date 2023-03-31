const router = require('express').Router()
const {setResponseHeaders, verifyUser} = require('../../modules/auth')
let db;
( async () => {
const dbInstance = await require('../../modules/database');
db = dbInstance
})()

router.post('/', async (req, res) => {
    try {
        setResponseHeaders(req, res)
		const user = await verifyUser(req)
let object = await db.get(user)
var devices = object.devices
var index = devices.findIndex(x => x.name == req.body.name)
if (index == -1) return res.status(409).send({ valid: false, response: 'Toto zařízení neexistuje' })
devices.splice(index, 1)
object.devices = devices
await db.set(user, object)
res.status(200).send({
    valid: true,
    devices: object.devices
})
    }
    catch (err) {return res.status(err.statusCode).send({ valid: false, response: err.message })}
})
module.exports = router