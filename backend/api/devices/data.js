const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const { table } = require('console');
const router = require('express').Router()
const {setResponseHeaders, verifyUser} = require('../../modules/auth')
const db = require('../../modules/database')
router.post('/', async (req, res) => {
  try {
    setResponseHeaders(req, res)
		const user = await verifyUser(req)
    const object = await db.get(user);
    const index = object.devices.findIndex(x => x.name == req.body.device);
    if (index == -1) return res.status(401).send({ valid: false, response: 'Zařízení nenalezeno' })
    const { token, url, org, bucket } = object.devices[index];
    if (!token || !url || !org || !bucket) return res.status(401).send({ valid: false, response: 'Není nastaven token nebo url' })
    const client = new InfluxDB({url, token})
    queryClient = client.getQueryApi(org)
    const query = `
      from(bucket: "${bucket}")
      |> range(start: -30d)
      |> limit(n: 10)
    `;
    //from(bucket: "${bucket}")
    //|> range(start: -12h)
    //|> filter(fn: (r) => r._measurement == "my-measurement")
    //|> limit(n: 10)
    const fluxTables = []
    await new Promise((resolve, reject) => {
      queryClient.queryRows(query, {
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
    }
    )
    //make array of measurements and filter only to send measurement name, time and value measurement:  [
      const measurements = {};
if (fluxTables.length == 0) return res.status(401).send({ valid: false, response: 'Nebyla nalezena žádná data' })
fluxTables[undefined].forEach(row => {
  const measurement = row[7];
  const date = row[4];
  const value = row[5];

  if (!measurements[measurement]) {
    measurements[measurement] = [];
  }

  measurements[measurement].push([date, value]);
});
    res.status(200).send({
      valid: true,
      response  : measurements
    })
  } catch (error) {
    console.error(error);
    res.status(400).send('Invalid token');
  }
})

module.exports = router;
