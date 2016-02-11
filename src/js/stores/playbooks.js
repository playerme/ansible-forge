import superagent from 'superagent'
import { browserHistory } from 'react-router'
import { routeActions } from 'react-router-redux'
import { uuidv4 } from 'node-uuid'
import { Map, Set } from 'immutable'

import {
	PLAYBOOKS_INDEX_LOADED,

	PLAYBOOKS_EDIT_LOADED,
	PLAYBOOKS_EDIT_CHANGE,
	PLAYBOOKS_EDIT_SAVING,
	PLAYBOOKS_EDIT_SAVED,
	PLAYBOOKS_EDIT_OPTIONS_ADD,
	PLAYBOOKS_EDIT_OPTIONS_REMOVE,
	PLAYBOOKS_EDIT_OPTIONS_CHANGE,
} from '../const'

const emptyOption = {
	slug: "",
	label: "",
	description: "",
	type: 'text',
	default: ""
}

const emptyPlaybook = {
	title: "",
	scheme: "",
	slug: "",
	requireOptions: false,
	options: [],
}


const initialState = {
	playbooks: Set(),
	activePlaybook: Map(emptyPlaybook),
	saving: false,
}


export default function reducer(state = initialState, action = {}) {

	let { type, data } = action

	switch(type) {

		case PLAYBOOKS_INDEX_LOADED: 

			return {
				...state,
				playbooks: Set(data)
			}

		case PLAYBOOKS_EDIT_LOADED:

			return {
				...state,
				activePlaybook: Map().merge(data)
			}

		case PLAYBOOKS_EDIT_CHANGE:

			return {
				...state,
				activePlaybook: state.activePlaybook.merge({ [data.which]: data.value }),
			}

		case PLAYBOOKS_EDIT_SAVING:

			return {
				...state,
				saving: true
			}

		case PLAYBOOKS_EDIT_SAVED:

			return {
				...state,
				saving: false
			}

		case PLAYBOOKS_EDIT_OPTIONS_ADD:

			return {
				...state,
				activePlaybook: state.activePlaybook.merge({
					options: state.activePlaybook.get('options').push(Map(emptyOption))
				})
			}

		case PLAYBOOKS_EDIT_OPTIONS_REMOVE:

			let newOptions1 = state.activePlaybook.get('options').filterNot(x => x.get('flag') === data.which)

			return {
				...state,
				activePlaybook: state.activePlaybook.merge({
					options: newOptions1
				})
			}

		case PLAYBOOKS_EDIT_OPTIONS_CHANGE:

			return {
				...state,
				activePlaybook: state.activePlaybook.merge({
					options: state.activePlaybook.get('options').map((opt) => {
						let flag = opt.get('flag')
						if (flag !== data.which) {
							return opt
						} else {
							return opt.set(data.field, data.value)
						}
					})
				})
			}

		default:

			return state

	}
}

export function fetchPlaybooks() {
	return (dispatch) => {
		superagent.get('/api/playbooks').end((err, res) => {
			dispatch({ type: PLAYBOOKS_INDEX_LOADED, data: res.body })
		})
	}
}

export function fetchOrNewPlaybook(slug) {
	return (dispatch) => {
		if (slug === 'new') {
			dispatch({ type: PLAYBOOKS_EDIT_LOADED, data: emptyPlaybook })
		} else {
			superagent.get(`/api/playbook/${slug}`).end((err, res) => {
				dispatch({ type: PLAYBOOKS_EDIT_LOADED, data: res.body })
			})
		}
	}
}

export function saveOrNewPlaybook(slug) {
	// we can't rely on state's slug to send a proper set of data, so we use the
	// slug arg to make sure we're always right.

	return (dispatch, getState) => {

		dispatch({ type: PLAYBOOKS_EDIT_SAVING })

		let { playbooks: { activePlaybook } } = getState()

		activePlaybook = activePlaybook.toObject()

		// safety so we don't do anything weird.
		delete activePlaybook.id

		let request

		if (slug === 'new') {
			request = superagent.put('/api/playbooks')
		} else {
			request = superagent.post(`/api/playbook/${slug}`)
		}

		request.send({playbook: activePlaybook}).end((err, res) => {
			dispatch({ type: PLAYBOOKS_EDIT_SAVED })
			dispatch(routeActions.replace(`/playbooks/${activePlaybook.slug}`))
		})

	}
}

export function onChange(meta, ev) {
	return (dispatch) => {
		meta.type = meta.type || 'text'

		let { which, type } = meta
		let { target } = ev

		let value

		switch(type) {
			case 'text':
				value = target.value
				break
			case 'checkbox':
				value = target.checked
				break
		}

		dispatch({type: PLAYBOOKS_EDIT_CHANGE, data: { which: which, value: value } })
	}
}

export function addBlankOption() {
	return { type: PLAYBOOKS_EDIT_OPTIONS_ADD }
}

export function removeOption(meta) {
	console.log('removing', meta)
	return { type: PLAYBOOKS_EDIT_OPTIONS_REMOVE, data: meta }
}

export function onOptionChange(meta, ev) {
	return (dispatch) => {
		let value

		switch(ev.target.type) {
			case 'checkbox':
				value = ev.target.checked
			default:
				value = ev.target.value
		}

		dispatch({ type: PLAYBOOKS_EDIT_OPTIONS_CHANGE, data: {
			which: meta.which,
			field: meta.field,
			value: value,
		} })
	}
}