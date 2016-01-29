import rethinkdbdash from 'rethinkdbdash'
import uuid from 'node-uuid'

import { spawnAnsible } from './runner'

export default class Forge {
	constructor(socketIo, rethinkDb) {
		this.io = socketIo
		this.r = rethinkDb || this.newRethinkDB()
		this.frameCache = {}
		this.frameIntv = {}
	}

	//
	// UTILS
	//
	newRethinkDB() {
		//TODO: configure server paths
		return rethinkdbdash({db: 'forge'})
	}

	//
	// DATA
	//
	newShell(args) {

		let data = {
			args: args,
			started_at: this.r.now(),
			state: 'initializing',
			frames: [],
		}

		return this.r.table('shells').insert([data]).run()
	}

	appendShell(id, data) {
		// rethinkdb isn't fast enough to handle all the frames. 
		// we cache them and flush first, when we get the end frame, 
		// and every second.

		if (this.frameCache[id] === undefined) {
			this.frameCache[id] = []
		}

		let frames = this.frameCache[id]
		frames.push(data)
		
		let flush = () => {
			console.log('flushed')
			this.r.table('shells').get(id).update({frames: frames}).run()
		}

		if(data.type === 'start') {
			this.frameIntv[id] = setInterval(flush, 1000*1)
		}

		switch(data.type) {
			case 'end':
			case 'error':
				clearInterval(this.frameIntv[id])
				flush()
				this.frameIntv[id] = this.frameCache[id] = frames = undefined
				break
			case 'start':
				flush()
		}

	}

	getShell(id) {
		return this.r.table('shells').get(id).run()
	}

	indexShells() {
		return this.r.table('shells').run()
	}

	//
	// HANDLERS
	//
	handleDeployShell(id, type, data) {
		// maybe an eventemitter instead?

		let payload = {type: type, data: data}

		this.io.of(`/shell/${id}`).emit('shell', payload)
		this.appendShell(id, payload)
	}

	//
	// API CONTROLLERS
	//
	newDeploy(req, res) {
		let which = req.body.which || "-i dev-inv test.yml"
		let flags = ""

		if (req.body.flags !== undefined) {
			flags = "-e '"+JSON.stringify(req.body.flags)+"'"
		}

		let args = `${which} ${flags}`.trim()
		
		this.newShell(args).then((result) => {

			let id = result.generated_keys[0]

			res.send({id: id})

			spawnAnsible(args, this.handleDeployShell.bind(this, id))
			
		})
	}

	getDeploy(req, res) {
		this.getShell(req.params.id).then((row, err) => {
			res.send(row)
		})
	}

}