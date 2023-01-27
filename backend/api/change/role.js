const router = require('express').Router();
import { isOriginAllowed, checkIfExists, getUser, getDBall, setDB } from '../../modules/auth';
router.post('/', async (req, res) => {
          res.header("Content-Type", 'application/json')
          if (!isOriginAllowed(req.get('origin'))) return res.status(401).send({valid: false, response: "pokus o spuštění z neautorizovaného zdroje"})
          if (!(await checkIfExists(req.body.username))) return res.status(409).send({valid: false, response: "Uživatel nexistuje"});
          var object = await getUser(req.body.username);
          object.admin = req.body.role == "admin" ?  true : alse
          object.role = req.body.role;
          var result = (await getDBall()).filter(key => key.data.user?.admin == true);
          if (result.length == 1 && req.body.username == result[0].ID) return res.status(409).send({valid: false, response: "Nelze odebrat admin práva poslednímu adminovi"});
          setDB(req.body.username, {user: object});
          res.status(200).send({valid: true});
    });
export default router;