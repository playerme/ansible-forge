import rethinkdbdash from 'rethinkdbdash'

const r = rethinkdbdash({db: 'forge'})

const Users = {
	
	index: () => r.table('users').run(),
	
	get: (slug) => r.table('users').filter(r.row('username').eq(slug)).run(),
	
	delete: (slug) => r.table('users').filter(r.row('username').eq(slug)).delete().run(),
	
	add: (data) => r.table('users').insert([data]).run(),
	
	modify: (slug, data) => r.table('users').filter(r.row('username').eq(slug)).update(data).run(),

	getByRole: (role) => r.table('users').filter(function(u) { return u('roles').contains(role) } ).run()

}

export { Users }