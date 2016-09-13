const lineup = require('lineup-template')
const hooks = require('../hooks')

module.exports = function(req, res) {

	const hook = req.params['0']
			.replace(/^\//, '')
			.replace(/\/$/, '') || '/' // Empty string is falsy

	const hookData = hooks[hook]

	if (hookData == null) {
		return res.status(404).json({status: 404, message: `invalid hook ${hook}`})
	}

	const config = {}

	Object.keys(hooks[hook]).forEach(key => {
		const value = hooks[hook][key]
		if (typeof(value) == 'string') {
			config[key] = lineup(value, process.env)
		} else {
			config[key] = value
		}
	})

	let hookPromises = config.hooks.map(h => () => {
		const module = require(`${__dirname}/../plugins/${h}`)
		return module(config, req.body)
	})

	let prev = hookPromises.shift()

	hookPromises.reduce((total, cur) => total.then(cur), prev())

	res.sendStatus(200)
}