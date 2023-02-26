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
let object = await db.get(user)
var devices = object.devices
if (devices == undefined) devices = []
res.status(200).send({
    valid: true,
    devices: devices
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