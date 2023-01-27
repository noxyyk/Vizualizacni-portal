import { Router } from 'express';
const router = Router();

//auth
import deleteUser from './auth/delete';
import login from './auth/login';
import register from './auth/register';
import verify from './auth/verify';
//change
import changeRole from './change/role';
import change from './change/change';
//info
import userList from './info/userlist';
import footer from './info/footer';
//routes
router.use('/delete', deleteUser);
router.use('/login', login);
router.use('/register', register);
router.use('/verify', verify);

router.use('/role', changeRole);
router.use('/change', change);

router.use('/userlist', userList);
router.use('/footer', footer);

export default router;