let db;
const logger = require("../logs/logger");
( async () => {
const dbInstance = await require('./database');
db = dbInstance
})()
module.exports = {
    removewrongdevices: async function () {//delete all devices with wrong name
        return
    	const result = (await db.all()).filter(
            (key) => key.value.user != undefined
        )

        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            if (element.value.devices == undefined || element.value.devices.length == 0) continue
            let newdevices = []
            for (let j = 0; j < element.value.devices.length; j++) {
                const device = element.value.devices[j];
        if (device.name == undefined || typeof device.name != 'string' ||device.name.match(/^[a-zA-Z0-9]+$/) == null) {
            logger.info(`removed wrong device ${element.ID}, ${device.name}`)
        } else {
            newdevices.push(device)
        }

            }
            if (newdevices.length != element.value.devices.length) {
                element.value.devices = newdevices
            await db.set(element.ID, element.value)
            }
        
        }
    },
    removewrongusers: async function () {//delete all users with wrong name
return
        const result = (await db.all()).filter( 
            (key) => key.value.user != undefined
        )
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
                let user = element.value.user
                if (user.ID == undefined  || user.avatar == undefined || user.createdTimestamp == undefined|| typeof user.password != "string") {
                    let response = {"ID": user.ID, "avatar": user.avatar, "time": user.createdTimestamp}
                    logger.info(`removed wrong user ${element.id}, ${response}`)
                    await db.delete(element.id)
                }
        }
    },
}