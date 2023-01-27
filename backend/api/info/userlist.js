const router = require('express').Router();
const auth = require('../../modules/auth');
router.get('/', async (req, res) => {
    res.header("Content-Type", 'application/json');
    var result = (await auth.getDBall()).filter(key => key.data.user != undefined);
    res.status(200).send({valid: true, users: result});
    });
module.exports = router;