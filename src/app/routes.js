import uuid from 'node-uuid'

import {
	Users
} from './data'

import { spawnAnsible } from './runner'

export function doRouting(r, io) {

	r.post('/deploy-this-shit!', (req, res) => {
		let ansibleArgs = '-i dev-inv test.yml'

		let shellId = uuid.v4()

		res.send({id: shellId})
		spawnAnsible(ansibleArgs, (type, data) => io.of('/shell/'+shellId).volatile.emit('shell', {type: type, data: data}))
	})
}
