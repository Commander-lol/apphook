const lineup = require('lineup-template')
const hooks = require('../hooks')

function loadPlugin(name) {
	let plugin = null
	try {
		plugin = require('../plugins/' + name)
	} catch (e) {
		if (e.message.startsWith('Module not found')) {
			plugin = require('apphook-recipe-' + name)
		}
	}
	return plugin
}

function resolveHookPath(path) {
	const stripSlash = s => s.replace(/^\//, '').replace(/\/$/, '') || '/'
	switch(env('NESTING_STRATEGY')) {
		case 'flat': {
			const converted = stripSlash(path).split('/').join('-')
			if (converted === '-') return '/'
			return converted
		}
		case 'deep':
		default:
			return path
				.replace(/^\//, '') // Strip leading slash
				.replace(/\/$/, '') // Strip trailing slash
				|| '/' // Empty string = index
	}
}

module.exports = function(req, res) {

	const hook = resolveHookPath(req.params['0'])

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

	let hookPromises = config.hooks.map(h => (success) => {
		if (success) {
			const module = loadPlugin(h)
			if (module == null) return Promise.resolve(false)
			return module(config, req.body)
		} else {
			return Promise.resolve(false)
		}
	})

	let prev = hookPromises.shift()

	hookPromises
		.reduce((total, cur) => total.then(cur), prev(true))
		.then(success => {
			if (!success) {
				throw new Error('Failed to execute all registered plugins')
			}
			res.sendStatus(200)
		})
		.catch(err => res.status(500).json({ message: err.message, code: 500 }))
}
