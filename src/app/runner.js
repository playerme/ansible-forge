import { exec } from 'child-process-promise'

const ansibleDir = "../Ansible"

export function spawnAnsible(args, cb) {
	process.env.PYTHONUNBUFFERED = 1
	process.env.ANSIBLE_FORCE_COLOR = 1

	cb('start')
	cb('progress', new Buffer("forge> ansible-playbook "+args))

	const ansible = exec('ansible-playbook '+args, { cwd: ansibleDir })
		.progress((child) => child.stdout.on('data', (data) => cb('progress', data)))
		.then(() => cb('end'))
		.catch((err) => cb('error', err))
}

