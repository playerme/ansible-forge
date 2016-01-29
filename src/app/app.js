"use strict"
import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import http from 'http'
import ioPkg from 'socket.io'
import morgan from 'morgan'

import { doRouting } from './routes'
import Forge from './Forge'

var app = express()
const r = express.Router()
var s = http.Server(app)

var io = ioPkg(s)

io.on('connection', (socket) => {
	console.log('a connection appeared!')
})

const F = new Forge(io)

doRouting(r, F)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use('/api', r)
app.use('/dist', express.static('dist'))
app.use(express.static('static'))

app.get('*', (req, res) => {
	//TODO: consider server-side react rendering
	res.send(fs.readFileSync('static/index.html', {encoding: 'utf-8'}))
})

s.listen(2055)