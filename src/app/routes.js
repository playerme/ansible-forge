export function doRouting(r, F) {
	
	r.post('/deploy/:slug', F.newDeploy.bind(F))

	r.get('/shells', F.getDeploys.bind(F))
	r.get('/shell/:id', F.getDeploy.bind(F))

	r.get('/playbooks', F.getPlaybooks.bind(F))
	r.get('/playbook/:slug', F.getPlaybook.bind(F))
	r.put('/playbooks', F.newPlaybook.bind(F))
	r.post('/playbook/:slug', F.updatePlaybook.bind(F))
	r.delete('/playbook/:slug', F.deletePlaybook.bind(F))
}
