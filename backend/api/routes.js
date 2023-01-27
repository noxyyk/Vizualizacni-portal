const express = require('express');
const router = express.Router();
//auth
const deleteUser = require('./auth/delete');
const login = require('./auth/login');
const register = require('./auth/register');
const verify = require('./auth/verify');
//change
const changeRole = require('./change/role');
const change = require('./change/change');
//info
const userList = require('./info/userlist');
const footer = require('./info/footer');
//routes
router.use('/delete', deleteUser);
router.use('/login', login);
router.use('/register', register);
router.use('/verify', verify);

router.use('/role', changeRole);
router.use('/change', change);

router.use('/userlist', userList);
router.use('/footer', footer);

module.exports = router;