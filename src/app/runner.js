import { exec } from 'child-process-promise'

const ansibleDir = "../Ansible"

export function spawnAnsible(args, cb) {
	process.env.PYTHONUNBUFFERED = 1
	process.env.ANSIBLE_FORCE_COLOR = 1

	cb('start', `<span style="color:#f0f">forge&gt;</span> <span style="color:#ff0">ansible-playbook ${args}</span>\nStarted at <span style="color:#0ff">${new Date()}</span>\n\n`)

	console.log('spawning')
	console.log('forge> ansible-playbook '+args)

	const ansible = exec('ansible-playbook '+args, { cwd: ansibleDir })
		.progress((child) => child.stdout.on('data', (data) => cb('progress', data)))
		.then(() => cb('end'), (err) => cb('error', err.msg))
}

