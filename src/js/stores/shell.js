import io from 'socket.io-client'
import superagent from 'superagent'

import {
	SHELL_UNLOADED,
	SHELL_START,
	SHELL_PROGRESS,
	SHELL_END,
	SHELL_ERROR,
	SHELL_STATE_UNKNOWN,
	SHELL_STATE_RUNNING,
	SHELL_STATE_FINISHED,
	SHELL_STATE_FAILED,
} from '../const'

const initialState = {
	data: "",
	status: SHELL_STATE_UNKNOWN,
}

export default function reducer(state = initialState, action = {}) {
	let { type, data } = action

	switch(type) {

		case SHELL_START:

			return {
				data: state.data+data,
				status: SHELL_STATE_RUNNING
			}

		case SHELL_PROGRESS:

			return {
				data: state.data+data,
				status: state.status
			}
		
		case SHELL_END:

			return {
				...state,
				status: SHELL_STATE_FINISHED
			}

		case SHELL_ERROR:

			return {
				...state,
				status: SHELL_STATE_FAILED
			}

		case SHELL_UNLOADED:
		
			return initialState

		default:

			return state

	}

}

function handleFrame(frame) {
	return {
		...frame,
		type: 'shell.'+frame.type
	}
}

export function loadShell(id) {
	return (dispatch) => {

		superagent.get(`/api/shell/${id}`).end((err, res) => {
			res.body.frames.forEach(frame => dispatch(handleFrame(frame)))
		})

	}
}

export function listenToShell(id) {
	return (dispatch) => {

		let socket = io(`/shell/${id}`)

		socket.on('shell', (frame) => dispatch(handleFrame(frame)))

	}
}

export function unloadShell() {
	return { type: SHELL_UNLOADED }
}