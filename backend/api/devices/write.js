//write a value inside influxdb
const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const router = require('express').Router()
const {setResponseHeaders, verifyUser} = require('../../modules/auth')
const logger = require('../../logs/logger')
const rateLimit = require('express-rate-limit')
let db;
( async () => {
const dbInstance = await require('../../modules/database');
db = dbInstance
})()

async function checkPlan(userPlan) {
    let limit
    switch (userPlan) {
      case 'basic':
        limit = 10
        break
      case 'advanced':
        limit = 100
        break
      case 'admin':
        limit = 200
        break
      default:
        limit = 1
    }
    const limiter = rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: limit,
      message: `Překročili jste limit počtu požadavků pro plán ${userPlan}. Zkuste to prosím později.`
    })
    return limiter
  }
router.post('/', async (req, res, next) => {// /api/write?device=abc&tag=devID&value=12&tagvalue=22&measurement=temperature
        try {
        setResponseHeaders(req, res)
        const user = await verifyUser(req)
        let object = await db.get(user)
        const limiter = checkPlan(object.user.plan)
        limiter(req, res, async () => {
        var devices = object.devices
        const {tag, value, tagvalue, measurement, device} = req.query
        var index = devices.findIndex(x => x.name == device)
        if (index == -1) return res.status(409).send({ valid: false, response: 'Toto zařízení neexistuje' })
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
    })
  } catch (err) {
    next(err)
  }
})
module.exports = router;