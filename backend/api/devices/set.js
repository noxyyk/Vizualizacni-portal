const router = require('express').Router()
const {setResponseHeaders, verifyUser} = require('../../modules/auth')
const db = require('../../modules/database')
const {InfluxDB, FluxTableMetaData} = require('@influxdata/influxdb-client')

async function validateInfluxDBVariables(token, url, org, bucket) {
  try {
    if (!token || !url || !org || !bucket) return false
    const client = new InfluxDB({url, token})
    const queryApi = client.getQueryApi(org)
    const query = `from(bucket:"${bucket}") |> range(start: -1h)`
    const fluxTables = []
    await new Promise((resolve, reject) => {
      queryApi.queryRows(query, {
        next(row, tableMeta) {
          const table = fluxTables[tableMeta.id] || (fluxTables[tableMeta.id] = [])
          table.push(row)
        },
        error(error) {
          reject(error)
        },
        complete() {
          resolve()
        },
      })
    })
    // const result = await Promise.all(fluxTables.map(async (table) => new FluxTableMetaData(table).toObject()))
    //if (result.length == 0) throw result.length + ' - Nebyla nalezena žádná data'
  } catch (error) {
    throw error
  }
}

router.post('/', async (req, res) => {
  try {
    setResponseHeaders(req, res)
	const user = await verifyUser(req)
    const object = await db.get(user);
    const index = object.devices.findIndex(x => x.name == req.body.device);
    if (index == -1) return res.status(401).send({ valid: false, response: 'Zařízení nenalezeno' })
    const { token, url, org, bucket } = req.body;
    await validateInfluxDBVariables(token, url, org, bucket)
    let device = {
        name: req.body.device,
        createdTimestamp: object.devices[index].createdTimestamp,
        data: object.devices[index].data,
        token: token,
        url: url,
        org: org,
        bucket: bucket
    }
    object.devices[index] = device;
    await db.set(user, object)
    res.status(200).send({
        valid: true,
        devices: object.devices[index]
    })
  } catch (error) {
    res.status(400).send({valid: false, response: error});
  }
})

module.exports = router;
