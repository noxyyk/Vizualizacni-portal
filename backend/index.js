const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./config')
const logger = require('./logs/logger')
const apiRouter = require('./api/routes');
const scripts = require('./modules/scripts.js')
if (process.env.NODE_ENV !== 'development') require('dotenv').config()
const { originsAllowed, port } = config.server


app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api', apiRouter);

// Global error handler middleware
app.use(function(err, req, res, next) {
	const statusCode = err.statusCode || 500;
	const message = err.message || (typeof err == "string"? err : 'Chyba serveru, zkuste to znovu později');
	logger.error(`ERROR ${statusCode} ${message} at ${req.url}`);
	res.status(statusCode).send({ valid: false, response: message });
  });
// Remove wrong devices and users on server start
scripts.removewrongdevices()
scripts.removewrongusers()
// Start the server
const server = app.listen(port, function () {
	console.clear()
	const address = server.address();
	if (!address) {
		logger.error(`Failed to start server on port ${port}`);
		process.exit(1);
	}
	const mode = process.env.NODE_ENV === 'development' ? 'Development' : 'Production';
	const url = process.env.NODE_ENV === 'development' ? "http://localhost:" + port : originsAllowed[1];
	logger.info(`${mode} mode, hosted on ${url}`);
}) 