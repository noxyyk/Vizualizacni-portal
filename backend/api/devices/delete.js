const router = require('express').Router()
const auth = require('../../modules/auth')
let { DB } = require('mongquick')
const db = new DB(process.env.MongoLogin)

router.post('/', async (req, res) => {
    try {
        res.header('Content-Type', 'application/json')
        if (!auth.isOriginAllowed(req.get('origin')))
            return res.status(401).send({
                valid: false,
                response: 'pokus o spuštění z neautorizovaného zdroje',
            })
        res.header('Access-Control-Allow-Origin', req.get('origin'))

        if (!(await auth.checkIfExists(req.body.username)))
            return res
                .status(409)
                .send({ valid: false, response: 'Uživatel s tímto jménem nexistuje' })
let object = await db.get(req.body.username)
var devices = object.devices
var index = devices.findIndex(x => x.name == req.body.name)
if (index == -1) return res.status(409).send({ valid: false, response: 'Toto zařízení neexistuje' })
devices.splice(index, 1)
object.devices = devices
await db.set(req.body.username, object)
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