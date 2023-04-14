const { InfluxDB} = require('@influxdata/influxdb-client');
const router = require('express').Router()
const jwt = require('jsonwebtoken');
const logger = require('../../logs/logger');
const rateLimit = require('express-rate-limit')
const {verifyUser, setResponseHeaders} = require('../../modules/auth')
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
router.get('/',limiter, async (req, res, next) => {
  try {
    setResponseHeaders(req, res)
    let authorization = req.headers.authorization?.split(" ")[1]
    if (!authorization) return res.status(401).send({ valid: false, response: 'nesprávný token' })
		const token_ = (await new Promise((resolve, reject) => {
			jwt.verify(
			  authorization,
			  process.env.JWTSECRET,
			  async function (err, decoded) {
				if (err || decoded == undefined || !(await db.has(decoded.iss))) {
				  reject(err);
				}
				  resolve(decoded);
			  }
			);
		  }));
    const user = token_.iss
    let device
    let website = (req.get("origin") == 'https://vizualizacni-portal.noxyyk.com')
    if(website) {
      device = req.query.device
  } else {
      device = token_.device
  }
    if (!user || !device) return res.status(401).send({ valid: false, response: 'nesprávný token' })
    const object = await db.get(user);
    const {tag, tagvalue, measurement} = req.query
    const index = object.devices.findIndex(x => x.name == device);
    if (index == -1) return res.status(401).send({ valid: false, response: 'Zařízení nenalezeno' })
    if (website){
      authorization = object.devices[index].secrets.tokens[0]
    }
    if(!(object.devices[index].secrets.tokens.includes(authorization))) return res.status(401).send({ valid: false, response: 'nesprávný token' })
    if(tag != object.devices[index].tag || tagvalue != object.devices[index].tagvalue) return res.status(401).send({ valid: false, response: 'nesprávný token' })
    const tokenIndex = object.devices[index].secrets.tokens.findIndex(x => x == authorization)
    if (new Date(object.devices[index].secrets.info[tokenIndex].lastUsed).getDate() != new Date().getDate()){ 
    object.devices[index].secrets.info[tokenIndex].lastUsed = new Date().getTime()  
    await db.set(user, object);
  }
    const { token, url, org, bucket } = object.devices[index];
    if (!token || !url || !org || !bucket) return res.status(401).send({ valid: false, response: 'Není nastaven token nebo url' })
    const client = new InfluxDB({url, token})
    queryClient = client.getQueryApi(org)
    const data = {};

    const query = `
    from(bucket: "${bucket}")
    |> range(start: -30d)
    |> filter(fn: (r) => r.${tag} == "${tagvalue}" and r._measurement == "${measurement}")
    |> limit(n: 30)
  `;
  await queryClient.queryRows(query, {
    next(row, tableMeta) {
      const tagKeyIndex = tableMeta.columns.findIndex((column) => column.label === tag);
      if (tagKeyIndex == -1 || row[tagKeyIndex] != tagvalue) return;
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
        res.status(400).send('žádná data');
        return;
      }
      res.status(200).send({
        valid: true,
        response: data,
      });
    },
  });
  } catch (err) {next(err)}
})

module.exports = router;