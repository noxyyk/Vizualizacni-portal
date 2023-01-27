const router = require('express').Router();
import { isOriginAllowed, checkIfExists, createPassword, getID, setDB, addID } from '../../modules/auth';
import { GetRandomItem } from '../../modules/array_sorting';
const avatars = Array.from({ length: 9 }, (_, i) => `./images/avatar_${i}.png`);
router.post('/', async (req, res) => {
    res.header("Content-Type", 'application/json');
    if (!isOriginAllowed(req.get('origin'))) return res.status(401).send({valid: false, response: "pokus o spuštění z neautorizovaného zdroje"})
    if ((await checkIfExists(req.body.username))) return res.status(409).send({valid: false, response: "Uživatel s tímto jménem již existuje"});
     
   let object = {
        "user": {
          "password": createPassword(req.body.password),
          "avatar": GetRandomItem(avatars, false),
          "verified": false,
          "email": null,
          "ID": (await getID()),
          "admin": false,
          "role": "user",
          "createdTimestamp": (Math.floor(new Date().getTime() / 1000))
        },
        "devices": []
      };
      setDB(req.body.username, object);
      addID()
      res.status(201).send({valid: true});
    });
export default router;