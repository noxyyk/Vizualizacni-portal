const { QuickDB, MongoDriver } = require("quick.db");
const mongoLogin = process.env.MongoLogin;
const mongoDriver = new MongoDriver(mongoLogin);
const logger = require("../logs/logger");

const dbPromise = mongoDriver.connect().then(async () => {
    const db = new QuickDB({ driver: mongoDriver });
    await db.init();
    return db;
  }).catch(err => {
    logger.log("error", "Database connection failed");
    process.exit(1);
  });
  
  module.exports = dbPromise;