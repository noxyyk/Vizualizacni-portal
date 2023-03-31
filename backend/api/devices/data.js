const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const router = require('express').Router()
const {setResponseHeaders, verifyUser} = require('../../modules/auth')
let db;
( async () => {
const dbInstance = await require('../../modules/database');
db = dbInstance
})()
router.post('/', async (req, res) => {
  try {
    setResponseHeaders(req, res)
		const user = await verifyUser(req)
    const object = await db.get(user);
    const index = object.devices.findIndex(x => x.name == req.body.device);
    if (index == -1) return res.status(401).send({ valid: false, response: 'Zařízení nenalezeno' })
    const { token, url, org, bucket } = object.devices[index];
    const tag = object.devices[index].tag||'devID';
    const tag_value = object.devices[index].tagvalue||'22';
    if (!token || !url || !org || !bucket) return res.status(401).send({ valid: false, response: 'Není nastaven token nebo url' })
    const client = new InfluxDB({url, token})
    queryClient = client.getQueryApi(org)
    const data = {};

    const query = `
    from(bucket: "${bucket}")
    |> range(start: -30d)
    |> limit(n: 30)
  `;
  await queryClient.queryRows(query, {
    next(row, tableMeta) {
      const tagKeyIndex = tableMeta.columns.findIndex((column) => column.label === tag);
      if (tagKeyIndex == -1) return;
      const tagValue = row[tagKeyIndex];
      if (tagValue != tag_value) return;
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
          value: tagValue
        }
      }
      data[measurement].values.push([time, value]);
    },
    error(error) {
      console.error(error);
      res.status(400).send('Invalid token');
    },
    complete() {
      console.log(data);
      if (Object.keys(data).length == 0) {
        res.status(400).send('Invalid token');
        return;
      }
      res.status(200).send({
        valid: true,
        response: data,
      });
    },
  });




  return
    await queryClient.queryRows(query, {
      next(row, tableMeta) {
        const measurement = row[7];
    
        if (!data[measurement]) {
          data[measurement] = [];
        }
        data[measurement].push([row[4], row[5]]);
      },
      error(error) {
        console.error(error);
        res.status(400).send('Invalid token');
      },
      complete() {
        if (Object.keys(data).length == 0) {
          res.status(400).send('no data');
          return;
        }
        res.status(200).send({
          valid: true,
          response: data,
        });
      },
    });
    return
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
      const measurements = {};
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
// [
//   '',
//   '6',
//   '2023-02-28T14:22:20.126686159Z',
//   '2023-03-30T14:22:20.126686159Z',
//   '2023-03-24T10:28:34.238Z',
//   '99',
//   'temperature',
//   'temperature',
//   '22'
// ] Y {
//   columns: [
//     M {
//       dataType: 'string',
//       group: false,
//       defaultValue: '_result',
//       label: 'result',
//       index: 0
//     },
//     M {
//       dataType: 'long',
//       group: false,
//       defaultValue: '',
//       label: 'table',
//       index: 1
//     },
//     M {
//       dataType: 'dateTime:RFC3339',
//       group: true,
//       defaultValue: '',
//       label: '_start',
//       index: 2
//     },
//     M {
//       dataType: 'dateTime:RFC3339',
//       group: true,
//       defaultValue: '',
//       label: '_stop',
//       index: 3
//     },
//     M {
//       dataType: 'dateTime:RFC3339',
//       group: false,
//       defaultValue: '',
//       label: '_time',
//       index: 4
//     },
//     M {
//       dataType: 'double',
//       group: false,
//       defaultValue: '',
//       label: '_value',
//       index: 5
//     },
//     M {
//       dataType: 'string',
//       group: true,
//       defaultValue: '',
//       label: '_field',
//       index: 6
//     },
//     M {
//       dataType: 'string',
//       group: true,
//       defaultValue: '',
//       label: '_measurement',
//       index: 7
//     },
//     M {
//       dataType: 'string',
//       group: true,
//       defaultValue: '',
//       label: 'devID',
//       index: 8
//     }
//   ]
// }