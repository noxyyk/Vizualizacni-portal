const router = require('express').Router()
const {setResponseHeaders, verifyUser} = require('../../modules/auth')
const db = require('../../modules/database')

router.post('/', async (req, res) => {
    try {
        setResponseHeaders(req, res)
		const user = await verifyUser(req)
        if (typeof req.body.new_name != 'string' ||req.body.new_name.match(/^[a-zA-Z0-9]+$/) == null) return res.status(401).send({ valid: false, response: 'Název zařízení je neplatný' })
let object = await db.get(user)
var devices = object.devices
var index = devices.findIndex(x => x.name == req.body.name)
if (index == -1) return res.status(409).send({ valid: false, response: 'Toto zařízení neexistuje' })
switch (req.body.type) {
    case 'name':
        devices[index].name = req.body.new_name
        break;
    default:
        return res.status(409).send({ valid: false, response: 'Neplatný typ' })
}
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