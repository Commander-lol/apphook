module.exports = new Proxy({}, {
	get(_, hook) {
		let c = null
		try {
			c = require(`./${hook}`)
		} catch(e) {} // eslint-disable-line no-empty
		return c
	}
})