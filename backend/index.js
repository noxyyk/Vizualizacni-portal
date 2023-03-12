console.clear()
process.stdout.write('\r' + 'Starting server...')
//start the website
const express = require('express')
const app = express()
const PORT = 5001
const bodyParser = require('body-parser')
const cors = require('cors')
if (process.env.NODE_ENV !== 'development') require('dotenv').config()
const { originsAllowed } = require('./modules/auth.js')
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', require('./api/routes.js'))
const scripts = require('./modules/scripts.js')
scripts.removewrongdevices()
scripts.removewrongusers()
var server = app.listen(PORT, function () {
	process.stdout.write(
		'\r' +
			((process.env.NODE_ENV == 'development'
				? 'Development mode' + ', hosted on ' + "http://localhost:" + PORT
				: 'Production mode' + ', hosted on ' + originsAllowed[1]) +
				' Port: ' +
				PORT +
				' Address: ' +
				server.address().address +
				'Family: ' +
				server.address().family +
				'\n')
	)
})
