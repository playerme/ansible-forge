"use strict"
import { argv } from 'yargs'
import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import http from 'http'
import ioPkg from 'socket.io'
import morgan from 'morgan'

import c from './configurator'
import { doRouting } from './routes'
import Forge from './Forge'

var app = express()
const r = express.Router()
var s = http.Server(app)

var io = ioPkg(s)

const F = new Forge(io)

doRouting(r, F)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use('/api', r)
app.use('/dist', express.static('dist'))
app.use(express.static('static'))

app.get('*', (req, res) => {
	fs.readFile('static/index.html', {encoding: 'utf-8'}, (err, data) => {
		res.send(data)
	})
})

console.log(`starting webserver on ${c.webserver.bind}:${c.webserver.port}`)

s.listen(
	c.webserver.port, c.webserver.bind
)