const router = require('express').Router()
const {setResponseHeaders, verifyUser} = require('../../modules/auth')
const db = require('../../modules/database')

router.get('/', async (req, res) => {
    try {
        setResponseHeaders(req, res)
		const user = await verifyUser(req)
let object = await db.get(user)
var devices = object.devices
if (devices == undefined) devices = []
res.status(200).send({
    valid: true,
    devices: devices
})
    }
    catch (err) {return res.status(err.statusCode).send({ valid: false, response: err.message })}
})
module.exports = router