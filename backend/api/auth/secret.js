const router = require('express').Router()
const jwt = require('jsonwebtoken')
const {setResponseHeaders, verifyUser } = require('../../modules/auth')
let db;
( async () => {
const dbInstance = await require('../../modules/database');
db = dbInstance
})()
router.post('/', async (req, res, next) => {
    try {
    setResponseHeaders(req, res)
    const user = await verifyUser(req)
    let object = await db.get(user)
    let devices = object.devices
    const index = devices.findIndex(x => x.name == req.body.device);
    if (index == -1) return res.status(401).send({ valid: false, response: 'Zařízení nenalezeno' })
    let secrets = devices[index].secrets
    switch (req.query.type) {
        case 'create':
        if (secrets == undefined) secrets = {tokens: [], info: []}
        const token = jwt.sign({ iss: user, device: req.body.device },process.env.JWTSECRET,{ algorithm: 'HS256' })
        secrets.tokens.push(token)
        secrets.info.push({created: new Date().getTime(), lastUsed: "nikdy"})
        object.devices[index].secrets = secrets
        const hidden = token.substring(0, 2) + '...' + token.substring(token.length - 4, token.length)
        await db.set(user, object)
        res.status(200).send({ valid: true, token: token, hidden: hidden})
        break
        case 'delete':
        if (secrets == undefined) return res.status(401).send({ valid: false, response: 'Žádné tokeny nebyly nalezeny' })
        if (req.body.token < secrets.tokens.lenght) return res.status(401).send({ valid: false, response: 'Žádné tokeny nebyly nalezeny' })
        secrets.tokens.splice(req.body.token, 1)
        secrets.info.splice(req.body.token, 1)
        object.devices.secrets = secrets
        await db.set(user, object)
        res.status(200).send({ valid: true, response: 'Token byl úspěšně smazán' })
        break
    }
} catch (err) {next(err)}
})
module.exports = router