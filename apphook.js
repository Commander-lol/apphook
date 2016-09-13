const fs = require('fs')
const express = require('express')
const morgan = require('morgan')
const FileStreamRotator = require('file-stream-rotator')
const body = require('body-parser')

const { port } = require('./config')

process.on('unhandledException', console.log.bind(console))

const handler = require('./lib/HookHandler')

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

app.use(/(.*)/, handler)

app.listen(port)
console.log(`apphooker hooking along on http://localhost:${port}`)