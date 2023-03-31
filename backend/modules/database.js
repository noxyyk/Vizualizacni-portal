const { QuickDB, MongoDriver } = require("quick.db");
const mongoLogin = process.env.MongoLogin;
const mongoDriver = new MongoDriver(mongoLogin);


module.exports = mongoDriver.connect().then(async () => {
    const db = new QuickDB({ driver: mongoDriver });
        await db.init();
        return db;
}).catch(err => {
    console.error("failed to connect to database", err);
});

