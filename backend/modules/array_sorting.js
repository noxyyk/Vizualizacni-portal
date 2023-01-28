function GetRandomItem(list, remove) {
	if (list.length < 1) return undefined
	var x = Math.floor(Math.random() * list.length)
	if (remove) {
		return list.splice(x, 1)[0]
	} else {
		return list[x]
	}
}

module.exports = {
	GetRandomItem,
}
