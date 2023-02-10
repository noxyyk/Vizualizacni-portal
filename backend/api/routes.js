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
router.use('/footer', require('./info/footer'))
router.use('/devices', require('./devices/device'))

module.exports = router 
