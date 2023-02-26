const router = require('express').Router()
const auth = require('../../modules/auth')
const db = require('../../modules/database')

router.post('/', async (req, res) => {
    try {
        res.header('Content-Type', 'application/json')
        if (!auth.isOriginAllowed(req.get('origin')))
            return res.status(401).send({
                valid: false,
                response: 'pokus o spuštění z neautorizovaného zdroje',
            })
        res.header('Access-Control-Allow-Origin', req.get('origin'))
        user = (await auth.verifyToken(req.body.token)).iss
        if (!(await auth.checkIfExists(user)))
            return res
                .status(409)
                .send({ valid: false, response: 'Uživatel s tímto jménem nexistuje' })
        if (req.body.device == undefined || typeof req.body.device != 'string' ||req.body.device.match(/^[a-zA-Z0-9]+$/) == null) return res.status(401).send({ valid: false, response: 'Název zařízení je neplatný' })
let object = await db.get(user)
let role = object.user.role
if (object.devices == undefined) object.devices = []
const maxDevices = object.user.admin ? 10 : role == 'advanced' ? 5 : 3
if (object.devices.length >= maxDevices) return res.status(401).send({ valid: false, response: 'Překročen limit zařízení, navyšte si plán' })
object.devices.push({name: req.body.device, createdTimestamp: Math.floor(Date.now() / 1000), data: []})
await db.set(user, object)
res.status(200).send({
    valid: true,
    devices: object.devices
})
    }
    catch (err) {
        console.log(err)
        res.status(500).send({
            valid: false,
            response: 'Nastala chyba, ' + err
        })
    }
})
module.exports = router