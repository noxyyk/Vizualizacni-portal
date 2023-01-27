const router = require('express').Router();
import { getDBall } from '../../modules/auth';
router.get('/', async (req, res) => {
    res.header("Content-Type", 'application/json');
    var result = (await getDBall()).filter(key => key.data.user != undefined);
    res.status(200).send({valid: true, users: result});
    });
export default router;