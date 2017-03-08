const fs = require('fs')
const express = require('express')
const morgan = require('morgan')
const FileStreamRotator = require('file-stream-rotator')
const body = require('body-parser')

require('dotenv').load()

global.env = (key, def = null) => (process.env[key] == null || process.env[key] === '') ? def : process.env[key]

process.on('unhandledException', console.error.bind(console))

const port = env('PORT', 9123)

const app = express()

{
	const dir = __dirname + '/log'

	fs.existsSync(dir) || fs.mkdirSync(dir)

	const stream = FileStreamRotator.getStream({
		date_format: 'YYYYMMDD',
		filename: dir + '/access-%DATE%.log',
		frequency: 'daily',
		verbose: false
	})

	app.use(morgan('combined', {
		stream
	}))
}

app.use(body.json())

const handler = require('./lib/HookHandler')
app.use(/(.*)/, handler)

app.listen(port)

console.log(`apphooker hooking along on http://localhost:${port}`)