import { exec, spawn } from 'child-process-promise'

const ansibleDir = "../Ansible"

export function spawnAnsible(args, cb) {
	process.env.PYTHONUNBUFFERED = 1
	process.env.ANSIBLE_FORCE_COLOR = 1
	process.env.ANSIBLE_NOCOWS = 1

	cb('start', `<span style="color:#f0f">forge&gt;</span> <span style="color:#ff0">ansible-playbook ${args}</span>\nStarted at <span style="color:#0ff">${new Date()}</span>\n\n`)

	console.log('spawning')

	console.log('forge> ansible-playbook ' + args.toString())

	const ansible = spawn('ansible-playbook', args.args, { cwd: ansibleDir })
		.progress((child) => { 
			child.stdout.on('data', (data) => cb('progress', data.toString()))
			child.stderr.on('data', (data) => cb('progress', data.toString()))
		})
		.then(() => {
			cb('end')
		}, (err) => { 
			console.error(err)
			cb('error', err.msg)
		})
		.catch((err) => {
			console.error(err)
			cb('error', err.msg)
		})
}

export function generateArgs(scheme, params) {
	let args = scheme.split(' ')

	if (params !== undefined && Object.getOwnPropertyNames(params).length !== 0) {
		args.push('-e')
		args.push(`'${JSON.stringify(extraVars)}'`)
	}

	return {
		args,
		toString: () => {
			return args.join(' ')
		}
	}
}
