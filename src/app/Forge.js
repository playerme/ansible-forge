import rethinkdbdash from 'rethinkdbdash'
import c from './configurator'

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
		return rethinkdbdash({
			...c.rethinkdb,
			db: 'forge'
		})
	}

	getRethinkDB() {
		return this.r
	}

	//
	// DATA
	//
	newShell(scheme, args, playbook) {

		let data = {
			args: args,
			started_at: this.r.now(),
			state: 'initializing',
			frames: [],
			playbook: playbook,
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
			this.r.table('shells').get(id).update({frames: frames, state: state}).run().catch((err) => {
				console.error(`shell ${id} flush failed`, err)
			})
		}

		if(data.type === 'start') {
			this.frameIntv[id] = setInterval(flush, 1000)
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
				
			if (d.length === 0) {
				return res.status(400).send({msg: `Cannot deploy playbook "${slug}", it doesn't exist.`})
			}

			let scheme = d[0].scheme

			let args = generateArgs(scheme, req.body.flags)
			
			this.newShell(slug, args.toString(), d[0]).then((result) => {

				let id = result.generated_keys[0]

				res.send({id: id})

				spawnAnsible(args, this.handleDeployShell.bind(this, id))
				
			}).catch((err) => { 
				res.status(500).send(err) 
			})
		}).catch((err) => { 
			res.status(500).send(err) 
		})
	}

	getDeploy(req, res) {
		this.getShell(req.params.id).then((row) => {
			
			if (row === null) {
				return res.sendStatus(404)
			}

			res.send(row)
		}).catch((err) => {
			res.status(500).send(err)
		})
	}

	getDeploys(req, res) {
		this.indexShells().then((rows, err) => {
			res.send(rows)
		}).catch((err) => { 
			res.status(500).send(err) 
		})
	}

	getPlaybook(req, res) {
		let slug = req.params.slug

		this.r.table('playbooks').filter({ slug: slug }).run().then((d) => {
			
			if (d.length === 0) {
				res.status(404).send({msg: `Playbook "${slug}" not found`})
			} else {
				res.send(d[0])
			}

		}).catch((err) => { 
			res.status(500).send(err) 
		})
	}

	getPlaybooks(req, res) {
		this.r.table('playbooks').orderBy('title').run().then((d) => {
			res.send(d)
		}).catch((err) => {
			res.status(500).send(err)
		})
	}

	updatePlaybook(req, res) {

		let data = req.body.playbook

		this.r.table('playbooks').filter({slug: req.params.slug}).update(data).run().then((d) => {
			res.send(d)
		}).catch((err) => {
			res.status(500).send(err)
		})
	}

	newPlaybook(req, res) {

		let data = req.body.playbook

		if (data.title === "" || data.scheme === "" || data.slug === "") {
			return res.status(400).send({ msg: "Title, Slug, and Scheme must be set." })
		}

		this.r.table('playbooks').filter({slug: data.slug}).run().then((d) => {
			if (d.length !== 0) {
				res.status(409).send({ msg: `Playbook with slug ${data.slug} already exists.` })
			} else {
				this.r.table('playbooks').insert([data]).run().then((d) => {
					res.send(d)
				}).catch((err) => {
					res.status(500).send(err)
				})
			}

		}).catch((err) => {
			res.status(500).send(err)
		})

	}

	deletePlaybook(req, res) {
		this.r.table('playbooks').filter({slug: req.params.slug}).delete().run().then((d) => {
			res.send(d)
		}).catch((err) => {
			res.status(500).send(err)
		})
	}

}