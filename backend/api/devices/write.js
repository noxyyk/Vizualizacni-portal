//write a value inside influxdb
const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const router = require('express').Router()
const {verifyUser} = require('../../modules/auth')
const logger = require('../../logs/logger')
const jwt = require('jsonwebtoken')
const rateLimit = require('express-rate-limit')
let db;
( async () => {
const dbInstance = await require('../../modules/database');
db = dbInstance
})()
const requests = {
  'user': 10,
  'advanced': 100,
  'admin': 1000
}
const getUserRole= async (req) => {
  const user = await verifyUser(req)
  const object = await db.get(user);
  if (object.user.admin) return requests['admin']
  return requests[object.user.role]
}
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: async (req, res, next) => {
    return await getUserRole(req)
  },
  message: async (req, res) => {
    return {response:`Váš limit požadavků byl překročen, zkuste to později nebo si zvolte jiný plán. Váš limit je ${await getUserRole(req)} požadavků za hodinu.`, valid: false};
  },
});
router.post('/',limiter, async (req, res, next) => {// /api/write?tag=devID&value=12&tagvalue=22&measurement=temperature
        try {
        res.setHeader('Access-Control-Allow-Origin', '*')
        const authorization = req.headers.authorization.split(" ")[1]
        const user = await verifyUser(req)
        let object = await db.get(user)
        var devices = object.devices
        const {tag, value, tagvalue, measurement} = req.query
        if (tag == undefined || value == undefined || tagvalue == undefined || measurement == undefined) return res.status(401).send({ valid: false, response: 'Některý z parametrů je neplatný' })
        const device = jwt.decode(authorization).device
        var index = devices.findIndex(x => x.name == device)
        if (index == -1) return res.status(409).send({ valid: false, response: 'Toto zařízení neexistuje' })
        if(!(object.devices[index].secrets.tokens.includes(authorization))) return res.status(401).send({ valid: false, response: 'nesprávný token' })
        if(tag != object.devices[index].tag || tagvalue != object.devices[index].tagvalue) return res.status(401).send({ valid: false, response: 'nesprávný token' })
        const tokenIndex = object.devices[index].secrets.tokens.findIndex(x => x == authorization)
        if (new Date(object.devices[index].secrets.info[tokenIndex].lastUsed).getDate() != new Date().getDate()){ 
          object.devices[index].secrets.info[tokenIndex].lastUsed = new Date().getTime()  
          await db.set(user, object);
        }
        const { url, token, org, bucket } = object.devices[index]
            const client = new InfluxDB({ url, token })
            const writeApi = client.getWriteApi(org, bucket)
            const point = new Point(measurement)
            point.tag(tag, tagvalue)
            point.floatField('value', value)
            writeApi.writePoint(point)
        logger.info('Data byla úspěšně zapsána')
        return res.status(200).send({
            valid: true,
            response: 'Data byla úspěšně zapsána'
        })
  } catch (err) {
    next(err)
  }
})
module.exports = router;