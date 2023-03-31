const router = require('express').Router()
const  {setResponseHeaders, checkIfExists} = require('../../modules/auth')
const jwt = require('jsonwebtoken')
let db;
( async () => {
const dbInstance = await require('../../modules/database');
db = dbInstance
})()

router.post('/', async (req, res) => {
	try {
	setResponseHeaders(req, res)
	jwt.verify(
		req.headers.authorization?.split(' ')[1],
		process.env.JWTSECRET,
		async function (err, decoded) {
			if (err) return res.status(401).send({ valid: false, response: 'Nastala chyba, zkuste to znovu později'})
			if (decoded == undefined)
				return res.status(500).send({
					valid: false,
					response: 'Nastala chyba, zkuste to znovu později',
				})
			if (!(await checkIfExists(decoded.iss)))
				return res
					.status(409)
					.send({ valid: false, response: 'uživatel neexistuje' })
			var object = (await db.get(decoded.iss)).user
			for (var j in object) {
				d = decoded[String(j)]
				o = object[String(j)]
				if (o == undefined || d == undefined || o == d) continue
				console.log(decoded.iss, j, '( database: ', o, ', ', 'token: ', d, ')')
				return res
					.status(401)
					.send({ valid: false, response: 'Nastala chyba, přihlašte se znovu' })
			}

			res.status(200).send({
				valid: true,
				role: decoded.role,
				email: decoded.email,
				verified: decoded.verified,
				pfp: decoded.avatar,
				user: decoded.iss,
				role: decoded.role,
				admin: decoded.admin,
				ID: decoded.ID,
				createdTimestamp: decoded.createdTimestamp,
			})
		}
	)
}
catch (err) {return res.status(err.statusCode).send({ valid: false, response: err.message })}
})
module.exports = router
