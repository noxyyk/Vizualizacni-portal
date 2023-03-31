let db;
( async () => {
const dbInstance = await require('./database');
db = dbInstance
})()
module.exports = {
    removewrongdevices: async function () {//delete all devices with wrong name
        return
    	const result = (await db.all()).filter(
            (key) => key.data.user != undefined
        )

        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            if (element.data.devices == undefined || element.data.devices.length == 0) continue
            let newdevices = []
            for (let j = 0; j < element.data.devices.length; j++) {
                const device = element.data.devices[j];
        if (device.name == undefined || typeof device.name != 'string' ||device.name.match(/^[a-zA-Z0-9]+$/) == null) {
            console.log("removed wrong device", element.ID, device.name)
        } else {
            newdevices.push(device)
        }

            }
            if (newdevices.length != element.data.devices.length) {
                element.data.devices = newdevices
            await db.set(element.ID, element.data)
            }
        
        }
    },
    removewrongusers: async function () {//delete all users with wrong name
        return
        const result = (await db.all()).filter( 
            (key) => key.data.user != undefined
        )
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
                let user = element.data.user
                if (user.ID == undefined  || user.avatar == undefined || user.createdTimestamp == undefined) {
                    let response = {"ID": user.ID, "avatar": user.avatar, "time": user.createdTimestamp}
                    console.log(element.ID, response)
                    await db.delete(element.ID)
                }
        }
    },
}