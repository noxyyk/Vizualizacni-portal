const express = require('express')
const router = express.Router()
const rateLimit = require('express-rate-limit')
// Rate limiter for sensitive routes
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // limit each IP to 10 requests per hour
    message: 'Překročili jste limit počtu požadavků, zkuste to prosím později.'
})
// Rate limiter for default routes
const defaultLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 200, // limit each IP to 100 requests per hour
    message: 'Překročili jste limit počtu požadavků, zkuste to prosím později.'
})
// Rate limiter for admin routes
const adminLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000, // limit each IP to 100 requests per hour
    message: 'Překročili jste limit počtu požadavků, zkuste to prosím později.'
})
const strictLimiter = rateLimit({
    windowMs: 60 * 15 * 1000, // 1 hour
    max: 1, // limit each IP to 2 requests per hour
    message: 'Překročili jste limit počtu požadavků, zkuste to prosím později.'
})
//routes
router.use('/delete', strictLimiter, require('./auth/delete'))
router.use('/login', authLimiter,require('./auth/login'))
router.use('/register', authLimiter,require('./auth/register'))
router.use('/verify', defaultLimiter, require('./auth/verify'))
router.use('/secret',authLimiter, require('./auth/secret'))

router.use('/role', defaultLimiter, require('./change/role'))
router.use('/change', defaultLimiter, require('./change/change'))

router.use('/userlist', adminLimiter, require('./info/userlist'))
router.use('/logs',  adminLimiter, require('./info/logs'))
router.use('/contact', strictLimiter, require('./info/contact')) 

router.use('/getall', defaultLimiter, require('./devices/getall'))
router.use('/add', defaultLimiter, require('./devices/add'))
router.use('/remove', defaultLimiter, require('./devices/delete'))
router.use('/edit', defaultLimiter, require('./devices/edit'))
router.use('/data', defaultLimiter, require('./devices/data'))
router.use('/set', defaultLimiter,  require('./devices/set'))
router.use('/write',defaultLimiter, require('./devices/write'))
router.use('/live',defaultLimiter, require('./devices/live'))

module.exports = router 
