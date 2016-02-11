import superagent from 'superagent'
import history from '../utils/history'

import {
	SHELL_INDEX_LOADED
} from '../const'

const initialState = {
	shells: [],
}

export default function reducer(state = initialState, action = {}) {

	let { type, data } = action

	switch(type) {

		case SHELL_INDEX_LOADED: 

			return {
				...state,
				shells: data
			}

		default:

			return state

	}
}

export function fetchShells() {

	return (dispatch) => {

		superagent.get('/api/shells').end((err, res) => {

			dispatch({ type: SHELL_INDEX_LOADED, data: res.body })

		})

	}

}