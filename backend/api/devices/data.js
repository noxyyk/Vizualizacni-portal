const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const router = require('express').Router()
const {setResponseHeaders, verifyUser} = require('../../modules/auth')
const logger = require('../../logs/logger')
const rateLimit = require('express-rate-limit')
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
let db;
( async () => {
const dbInstance = await require('../../modules/database');
db = dbInstance
})()
router.post('/', limiter, async (req, res, next) => {
  try {
    setResponseHeaders(req, res)
    const user = await verifyUser(req)
    const object = await db.get(user);
    const devices = object.devices;
    const role = object.user.role;
    limiter.max = requests[role]
    const index = devices.findIndex(x => x.name == req.body.device);
    if (index == -1) return res.status(401).send({ valid: false, response: 'Zařízení nenalezeno' })
    const { token, url, org, bucket } = devices[index];
    const tag = devices[index].tag||'devID';
    const tagvalue = devices[index].tagvalue||'22';
    if (!token || !url || !org || !bucket) return res.status(401).send({ valid: false, response: 'Není nastaven token nebo url' })

    let secrets = devices[index].secrets;
    //make every secret.token to display as 2 letters, 3 dots, 4 letters
    if(!secrets) secrets = {tokens: [], info: []}
    for (let i = 0; i < secrets.tokens.length; i++) {
      const token = secrets.tokens[i];
      secrets.tokens[i] = token.substring(0, 2) + '...' + token.substring(token.length - 4, token.length)
    }

    const client = new InfluxDB({url, token})
    queryClient = client.getQueryApi(org)
    const data = {};

    const query = `
    from(bucket: "${bucket}")
    |> range(start: -30d)
    |> filter(fn: (r) => r.${tag} == "${tagvalue}")
    |> limit(n: 30)
  `;
    await queryClient.queryRows(query, {
      next(row, tableMeta) {
        const timeIndex = tableMeta.columns.findIndex((column) => column.label === '_time');
        const valueIndex = tableMeta.columns.findIndex((column) => column.label === '_value');
        const measurementIndex = tableMeta.columns.findIndex((column) => column.label === '_measurement');
        const time = row[timeIndex];
        const value = row[valueIndex];
        const measurement = row[measurementIndex];
        if (!data[measurement]) {
          data[measurement] = {
            values: [],
            tag: tag,
            value: tagvalue
          }
        }
        data[measurement].values.push([time, value]);
      },
      error(error) {
        logger.error(error)
        res.status(400).send('Invalid token');
      },
      complete() {
        if (Object.keys(data).length == 0) {
          res.status(400).send('Invalid token');
          return;
        }
        res.status(200).send({
          valid: true,
          response: data,
          secrets: secrets
        });
      },
    });
  } catch (err) {next(err)}
});

module.exports = router;