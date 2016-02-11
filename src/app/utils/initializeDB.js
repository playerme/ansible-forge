import rethinkdbdash from 'rethinkdbdash'
import yargs from 'yargs'
import Forge from '../Forge'

const argv = yargs.argv

if (argv.database || argv.dev) {
	const initial_r = rethinkdbdash()

	console.log("> Creating db: forge")
	initial_r.dbCreate('forge').run()
	
	console.log("> Dropping db: test")
	initial_r.dbDrop('test').run().catch(() => {
		console.log('>> test didn\'t exist, that\'s ok. continuing.')
	})
}

const F = new Forge(null)
const r = F.getRethinkDB()

if (argv.reset && argv.definitelyReset) {
	console.log('> Dropping db: forge')
	r.dbDrop('forge').run().then(() => { 
		console.log('> Thank you for using stop & drop, the #1 suicide booth in the north Atlantic.')
		process.exit()
	})
}

// setup db/tables
if (argv.create || argv.dev) {

	console.log('> Creating table: playbooks')
	let rchain = r.tableCreate('playbooks').run().then(() => {

		console.log('> Creating playbooks index: slug')
		return r.table('playbooks').indexCreate('slug').run()

	}).then(() => {

		console.log('> Creating table users')
		return r.tableCreate('users').run()

	}).then(() => {

		console.log('> Creating users index: username')
		return r.table('users').indexCreate('username').run()

	}).then(() => {

		console.log('> Creating table: shells')
		return r.tableCreate('shells').run()})

	.then(() => {

		console.log('> Creating shells index: started_at')
		return r.table('shells').indexCreate('started_at').run()
		
	}).then(() => {

		if (argv.seed !== false) {
			return seed()
		} else {
			return true
		}

	}).then(() => {

		process.exit()

	}).catch((err) => {

		console.error("A problem occurred:", err.msg)

	})


}

// seed
function seed() {
	console.log('> Seeding playbooks')
	return r.table('playbooks').insert([{
			"slug": "test",
			"scheme": "-i dev-inv test.yml",
			"requireOptions": true,
			"options": [
				{
					"flag": "superimportant", 
					"default": "yes but no", 
					"label": "Superimportant Field", 
					"type": "text", 
					"description": "Something that totally needs to be set 100% no decieve"
				},
				{
					"flag": "fail", 
					"default": true, 
					"label": "Fail", 
					"type": "checkbox", 
					"description": "Should we fail?"
				}
			],
			"title": "Test the shell output."
	}]).run()
	
}

if (!argv.dev && argv.seed) {
	seed()
}