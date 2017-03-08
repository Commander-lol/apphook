module.exports = new Proxy({}, {
	get(_, hook) {
		let c = null
		try {
			c = require(`./${hook}`)
		} catch(e) {
			if (!e.startsWith('Module not found')) {
				throw e
			}
		}
		return c
	}
})