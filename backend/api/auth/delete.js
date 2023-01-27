const router = require('express').Router();
import { isOriginAllowed, checkIfExists, deleteUser } from '../../modules/auth';

router.post('/', async (req, res) => {
    res.header("Content-Type", 'application/json');
    if (!isOriginAllowed(req.get('origin'))) return res.status(401).send({valid: false, response: "pokus o spuštění z neautorizovaného zdroje"})
    if (!(await checkIfExists(req.body.username))) return res.status(409).send({valid: false, response: "Uživatel s tímto jménem nexistuje"});
    deleteUser(req.body.username);
    res.status(200).send({valid: true});
    });
export default router;