const router = require('express').Router()
const package = require('../../package.json')
let package_ignore = ['scripts', 'devDependencies', 'main', 'restart']
Object.keys(package).forEach(async (key) => {
	if (package_ignore.includes(key)) {
		delete package[key]
	}
})
router.get('/', async (req, res) => {
	res.header('Content-Type', 'application/json')
	res.status(200).send({ valid: true, footer: package })
})
module.exports = router
