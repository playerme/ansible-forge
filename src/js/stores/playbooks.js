import superagent from 'superagent'
import history from '../utils/history'
import { Map, Set } from 'immutable'

import {
	PLAYBOOKS_INDEX_LOADED
} from '../const'

const initialState = {
	playbooks: [],
}

export default function reducer(state = initialState, action = {}) {

	let { type, data } = action

	console.log(type)

	switch(type) {

		case PLAYBOOKS_INDEX_LOADED: 

			return {
				...state,
				playbooks: data
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