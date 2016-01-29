import io from 'socket.io-client'
import superagent from 'superagent'
// move to isomorphic-fetch asap

const START = 'shell.start'
const PROGRESS = 'shell.progress'
const END = 'shell.end'
const ERROR = 'shell.error'
const SHELL_UNLOADED = 'shell.unloaded'

const STATE_UNKNOWN = 'unknown'
const STATE_RUNNING = 'running'
const STATE_FINISHED = 'finished'
const STATE_FAILED = 'failed'

const initialState = {
	data: "",
	status: STATE_UNKNOWN,
}

export default function reducer(state = initialState, action = {}) {
	let { type, data } = action

	switch(type) {

		case START:

			return {
				data: state.data+data,
				status: STATE_RUNNING
			}

		case PROGRESS:

			return {
				data: state.data+data,
				status: state.status
			}
		
		case END:

			return {
				...state,
				status: STATE_FINISHED
			}

		case ERROR:

			return {
				...state,
				status: STATE_FAILED
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