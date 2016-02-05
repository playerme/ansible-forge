import superagent from 'superagent'
import history from '../utils/history'
import { Map, Set } from 'immutable'

import {
	DEPLOY_TRIGGER,
	DEPLOY_OP_TOGGLE,
	DEPLOY_OPTION_CHANGE,
	DEPLOY_OPTIONS_LOADED,
	DEPLOY_DEPLOYING,
} from '../const'

const initialState = {
	options: Set(),
	currentlySelected: Map(),
	optionsPane: false,
	deploying: false,
}

export default function reducer(state = initialState, action = {}) {
	let { type, data } = action

	console.log(type)

	switch(type) {

		case DEPLOY_OP_TOGGLE:

			return {
				...state,
				optionsPane: !state.optionsPane
			}


		case DEPLOY_OPTION_CHANGE:

			let newData = state.currentlySelected.merge(data)

			console.log('newData =>', newData)

			return {
				...state,
				currentlySelected: newData
			}

		case DEPLOY_OPTIONS_LOADED:

			// data will come as [{ flag, default, label, type, description },...]
			let currentlySelected = Map()

			data.forEach((opt) => {
				currentlySelected.set(opt.flag, opt.default)
			})

			return {
				...state,
				options: Set(data),
				currentlySelected: currentlySelected,
			}


		case DEPLOY_DEPLOYING:

			return {
				...state,
				deploying: true
			}


		default:

			return state

	}
}

export function doDeploy() {
	// get opts, toss them in!
	// but first, let's reimplement.
	return (dispatch, getState) => {
		let { deploy: { currentlySelected } } = getState()

		superagent.post('/api/deploy').send({ flags: currentlySelected, which: '-i dev-inv test.yml' }).end((err, res) => {
			// use redux-router
			history.pushState(null, `/shell/${res.body.id}`)
		})
	}
}

export function optionChange(meta, event) {

	let { flag, type } = meta
	let data = null

	switch (type) {
		case 'checkbox': data = event.target.checked; break
		default: data = event.target.value; break
	}

	return (dispatch) => { return dispatch({type: DEPLOY_OPTION_CHANGE, data: { [flag]: data }}) }
}