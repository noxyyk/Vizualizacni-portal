const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const router = require('express').Router()
const {setResponseHeaders, verifyUser} = require('../../modules/auth')
const db = require('../../modules/database')

router.get('/', async (req, res) => {
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
    const rows = [];
    await queryClient.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row)
        const values = Object.values(o)
        console.log("values:", values, "tableMeta:", tableMeta, "o:", o);
        rows.push(values);
      },
      error(error) {
        console.error(error);
        res.status(500).send('Internal server error');
      },
      complete() {
        console.log("complete", rows);
        res.status(200).send({response: rows, valid: true});
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).send('Invalid token');
  }
})

module.exports = router;
