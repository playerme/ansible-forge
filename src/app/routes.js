export function doRouting(r, F) {

	r.get('/shells', F.getDeploys.bind(F))
	r.get('/shell/:id', F.getDeploy.bind(F))
	r.post('/deploy', F.newDeploy.bind(F))
}
