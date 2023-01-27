const router = require('express').Router();
import { isOriginAllowed, checkIfExists, authenticateUser, getUser, createToken, setUser } from '../../modules/auth';

router.post('/', async (req, res) => {
    res.header("Content-Type", 'application/json');
    if (!isOriginAllowed(req.get('origin'))) return res.status(401).send({valid: false, response: "pokus o spuštění z neautorizovaného zdroje"})
    if (!(await checkIfExists(req.body.username))) return res.status(409).send({valid: false, response: "Uživatel s tímto jménem nexistuje"});
    if (authenticateUser(req.body.username, req.body.password)) return res.status(401).send({valid: false, response: "Heslo se neshhoduje"});
    
    var object = await getUser(req.body.username);
    var token = createToken(req.body.username, object, req.body.stayLogged);
    if (token == undefined) return res.status(500).send({valid: false, response: "Nastala chyba, zkuste to znovu později"})
        object.user.loggedTimestamp = (Math.floor(new Date().getTime() / 1000));
        setUser(req.body.username, object)
      res.status(200).send({valid: true, pfp: object.user.avatar, token: token, admin: object.user.admin, role: object.user.role, ID: object.user.ID, createdTimestamp: object.user.createdTimestamp});

    });
export default router;