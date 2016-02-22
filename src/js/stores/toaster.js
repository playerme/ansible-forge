import {
	TOASTER_SHOW,
	TOASTER_HIDE,
} from '../const'

const initialState = {
	showing: false,
	text: {
		title: '',
		body: '',
	},
	level: null,
}

export default function reducer(state = initialState, {type, data} = {}) {
	switch(type) {

		case TOASTER_SHOW:

			return {
				...state,
				showing: true,
				...data,
			}

		case TOASTER_HIDE:

			return {
				...state,
				showing: false,
				text: { title: '', body: '' },
				level: null,
			}

		default:

			return state

	}
}

function toastFactory(level, text, timeout = 5000) {
	return (dispatch, getState) => {

		if (getState().toaster.showing) {
			return null
		}

		dispatch({
			type: TOASTER_SHOW,
			data: {
				text: text,
				level: level,
			}
		})

		if (timeout !== 0) {
			setTimeout(() => {
				dispatch(dismiss())
			}, timeout)
		}
		
	}
}

export function error(text, timeout) {
	return toastFactory('error', text, timeout)
}

export function success(text, timeout = null) {
	return toastFactory('success', text, timeout)
}

export function info(text, timeout) {
	return toastFactory('info', text, timeout)
}

export function warning(text, timeout) {
	return toastFactory('warning', text, timeout)
}

export function dismiss() {
	return {
		type: TOASTER_HIDE,
	}
}