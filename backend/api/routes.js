const express = require('express')
const router = express.Router()
//routes
router.use('/delete', require('./auth/delete'))
router.use('/login', require('./auth/login'))
router.use('/register', require('./auth/register'))
router.use('/verify', require('./auth/verify'))

router.use('/role', require('./change/role'))
router.use('/change', require('./change/change'))

router.use('/userlist', require('./info/userlist'))
router.use('/logs', require('./info/logs'))

router.use('/getall', require('./devices/getall'))
router.use('/add', require('./devices/add'))
router.use('/remove', require('./devices/delete'))
router.use('/edit', require('./devices/edit'))
router.use('/data', require('./devices/data'))
router.use('/set', require('./devices/set'))
router.use('/write', require('./devices/write'))

module.exports = router 
