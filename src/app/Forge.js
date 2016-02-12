import rethinkdbdash from 'rethinkdbdash'
import uuid from 'node-uuid'

import { generateArgs, spawnAnsible } from './runner'

// TODO: figure out how to separate this hulking shitty monolith.

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

	getRethinkDB() {
		return this.r
	}

	//
	// DATA
	//
	newShell(scheme, args) {

		let data = {
			args: args,
			started_at: this.r.now(),
			state: 'initializing',
			frames: [],
			playbook: scheme,
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
		
		let flush = (state = 'running') => {
			console.log('flushed')
			this.r.table('shells').get(id).update({frames: frames, state: state}).run()
		}

		if(data.type === 'start') {
			this.frameIntv[id] = setInterval(flush, 1000*1)
		}

		let state

		switch(data.type) {
			case 'end':
				state = 'finished'
			case 'error':
				state = state || 'errored'
				clearInterval(this.frameIntv[id])
				flush(state)
				this.frameIntv[id] = this.frameCache[id] = frames = undefined
				break
			case 'start':
				state = 'started'
				flush(state)
		}

	}

	getShell(id) {
		return this.r.table('shells').get(id).run()
	}

	indexShells() {
		return this.r.table('shells').orderBy({index: this.r.desc('started_at')}).run()
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
		let slug = req.params.slug

		this.r.table('playbooks').filter({ slug: slug }).run().then((d) => {
			let scheme = d[0].scheme

			let args = generateArgs(scheme, req.body.params)
			
			this.newShell(slug, args.toString()).then((result) => {

				let id = result.generated_keys[0]

				res.send({id: id})

				spawnAnsible(args, this.handleDeployShell.bind(this, id))
				
			})
			
		})
	}

	getDeploy(req, res) {
		this.getShell(req.params.id).then((row, err) => {
			res.send(row)
		})
	}

	getDeploys(req, res) {
		this.indexShells().then((rows, err) => {
			res.send(rows)
		})
	}

	getPlaybook(req, res) {
		let slug = req.params.slug

		this.r.table('playbooks').filter({ slug: slug }).run().then((d) => {
			res.send(d[0])
		}).catch((err) => { res.send(err) })
	}

	getPlaybooks(req, res) {
		this.r.table('playbooks').run().then((d) => {
			res.send(d)
		})
	}

	updatePlaybook(req, res) {

		let data = req.body.playbook

		this.r.table('playbooks').filter({slug: req.params.slug}).update(data).run().then((d) => {
			res.send(d)
		})
	}

	newPlaybook(req, res) {
		console.log(req.body)

		let data = req.body.playbook

		// TODO: check if slug collides

		this.r.table('playbooks').insert([data]).run().then((d) => {
			res.send(d)
		})
	}

	deletePlaybook(req, res) {
		this.r.table('playbooks').filter({slug: req.params.slug}).delete().run().then((d) => {
			res.send(d)
		})
	}

}