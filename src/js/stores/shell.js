import io from 'socket.io-client'
import superagent from 'superagent'

import * as toast from './toaster'

import {
	SHELL_UNLOADED,
	SHELL_LOADED,
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
	state: 'unknown',
	playbook: {},
}

export default function reducer(state = initialState, action = {}) {
	let { type, data } = action

	switch(type) {

		case SHELL_START:

			return {
				...state,
				data: state.data+data,
				status: SHELL_STATE_RUNNING
			}

		case SHELL_PROGRESS:

			return {
				...state,
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

		case SHELL_LOADED:

			return {
				...state,
				shellState: data.state,
				playbook: data.playbook,
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
			if (err !== null) {
				if (res.statusCode === 404) {
					dispatch(toast.error({body: res.body.msg}))
				} else {
					dispatch(toast.error({title: "Oops!", body: err.message}))
				}

				return;
			}

			dispatch({type: SHELL_LOADED, data: res.body})
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