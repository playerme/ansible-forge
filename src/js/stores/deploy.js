import superagent from 'superagent'
import { routeActions } from 'react-router-redux'
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
	requireOptions: false,
	playbook: {}
}

export default function reducer(state = initialState, action = {}) {
	let { type, data } = action

	// console.log(type)v 

	switch(type) {

		case DEPLOY_OP_TOGGLE:
			
			if (state.requireOptions) {
				return state
			}

			return {
				...state,
				optionsPane: !state.optionsPane
			}


		case DEPLOY_OPTION_CHANGE:


			let newData = state.currentlySelected.merge(data)

			return {
				...state,
				currentlySelected: newData
			}

		case DEPLOY_OPTIONS_LOADED:

			// data will come as [{ flag, default, label, type, description },...]

			let tmp = {}

			data.options.forEach((opt) => {
				tmp[opt.flag] = opt.default
			})

			let currentlySelected = Map().merge(tmp)

			return {
				...state,
				options: Set(data.options),
				currentlySelected: currentlySelected,
				optionsPane: data.requireOptions || state.optionsPane,
				requireOptions: data.requireOptions,
				playbook: data
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

export function doDeploy(slug) {
	// get opts, toss them in!
	// but first, let's reimplement.
	return (dispatch, getState) => {
		let { deploy: { currentlySelected, optionsPane } } = getState()

		let data = {}

		if (optionsPane) {
			data.flags = currentlySelected
		}

		superagent.post(`/api/deploy/${slug}`).send(data).end((err, res) => {
			// use redux-router
			dispatch(routeActions.push(`/shell/${res.body.id}`))
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

export function loadPlaybook(slug) {

	return (dispatch) => {

		superagent.get(`/api/playbook/${slug}`).end((err, res) => {

			dispatch({type: DEPLOY_OPTIONS_LOADED, data: res.body })

		})

	}
}