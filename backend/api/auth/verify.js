const router = require('express').Router();
import { isOriginAllowed, checkIfExists, getUser } from '../../modules/auth';
import { verify } from 'jsonwebtoken';
router.post('/', async (req, res) => {
    res.header("Content-Type", 'application/json');
    if (!isOriginAllowed(req.get('origin'))) return res.status(401).send({valid: false, response: "pokus o spuštění z neautorizovaného zdroje"})

    verify(req.body.token, process.env.JWTSECRET, async function(err, decoded) {
      if (err) return res.status(401).send({valid: false, response: err})
      if (decoded == undefined) return res.status(500).send({valid: false, response: "Nastala chyba, zkuste to znovu později"})
      if (!await (checkIfExists(decoded.iss))) return res.status(409).send({valid: false, response: "uživatel neexistuje"});
      var object = (await getUser(decoded.iss)).user;
      for (var j in object) {
          d = decoded[String(j)]
          o = object[String(j)] 
          if ((o == undefined || d == undefined) || (o == d )) continue;
          console.log(decoded.iss,j, "( database: ", o,", ","token: ", d, ")" )
          return res.status(401).send({valid: false, response: "Nastala chyba, přihlašte se znovu"})}
  
      res.status(200).send({valid: true,role: decoded.role, email:decoded.email, verified:decoded.verified, pfp: decoded.avatar, user: decoded.iss, role: decoded.role, admin: decoded.admin, ID: decoded.ID, createdTimestamp: decoded.createdTimestamp});
    }); 
    });
export default router;