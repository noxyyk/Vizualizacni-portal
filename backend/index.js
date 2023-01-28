console.clear()
process.stdout.write('\r' + 'Starting server...')
//start the website
const express = require('express')
const app = express()
const PORT = 5000
const bodyParser = require('body-parser')
const cors = require('cors')
const auth = require('./modules/auth.js')

if (process.env.NODE_ENV !== 'development') require('dotenv').config()

app.use((req, res, next) => {
	const origin = req.headers.origin
	if (auth.isOriginAllowed(origin)) {
		res.header('Access-Control-Allow-Origin', origin)
		next()
	} else {
		res.status(401).send(`Not allowed by CORS ${origin}`)
	}
})

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', require('./api/routes.js'))

var server = app.listen(PORT, function () {
	process.stdout.write(
		'\r' +
			((process.env.NODE_ENV == 'development'
				? 'Development mode' + ', hosted on ' + auth.originsAllowed[0]
				: 'Production mode' + ', hosted on ' + auth.originsAllowed[1]) +
				' Port: ' +
				PORT +
				' Address: ' +
				server.address().address +
				'Family: ' +
				server.address().family +
				'\n')
	)
})
