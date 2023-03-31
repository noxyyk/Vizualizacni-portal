//write a value inside influxdb
const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const router = require('express').Router()
const {setResponseHeaders, verifyUser} = require('../../modules/auth')
let db;
( async () => {
const dbInstance = await require('../../modules/database');
db = dbInstance
})()
router.post('/', async (req, res) => {// /api/write?device=abc&tag=devID&value=12&tagvalue=22&measurement=temperature
  //  try {
        setResponseHeaders(req, res)
        const user = await verifyUser(req)
        let object = await db.get(user)
        var devices = object.devices
        var index = devices.findIndex(x => x.name == req.query.device)
        if (index == -1) return res.status(409).send({ valid: false, response: 'Toto zařízení neexistuje' })
        const tag = "devID"//req.query.tag
        //onst value = //req.query.value
        const tagvalue = "1"// req.query.tagvalue
        const measurement = "temperature"//req.query.measurement
        const { url, token, org, bucket } = object.devices[index]
        for (let i = 0; i < 10; i++) {
            const client = new InfluxDB({ url, token })
            const writeApi = client.getWriteApi(org, bucket)
            const point = new Point(measurement)
            point.tag(tag, tagvalue)
            point.floatField('value', Math.random() * 100)
            writeApi.writePoint(point)
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
        return res.status(200).send({
            valid: true,
            response: 'Data byla úspěšně zapsána'
        })
        const point = new Point(measurement)
        point.tag(tag, tagvalue)
        point.floatField('value', value)
        writeApi.writePoint(point)
        writeApi.close()
        res.status(200).send({
            valid: true,
            response: 'Data byla úspěšně zapsána'
        })
    //} catch (err) {return res.status(err.statusCode||500).send({ valid: false, response: err.message||err })}
})
module.exports = router;