const router = require('express').Router()
const { setResponseHeaders, addlog, verifyUser} = require('../../modules/auth')
let db;
( async () => {
const dbInstance = await require('../../modules/database');
db = dbInstance
})()
router.post('/', async (req, res, next) => {
    try {
        setResponseHeaders(req, res)
        const user = await verifyUser(req)
        const { name, surname, email, company, company_size } = req.body
        const object = await db.get(user)
        await addlog(user,object.user.ID,object.user.avatar, 'žádost o profesionální plán', 'ROLE_REQUEST', {name: name, surname: surname, email: email, company: company, company_size: company_size});
        res.status(200).send({ valid: true })
}
catch (err) {next(err)}
})
module.exports = router