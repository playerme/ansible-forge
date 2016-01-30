import superagent from 'superagent'

const TL_CONTENT_LOADED = 'tl.TL_CONTENT_LOADED'

const initialState = {
	shellsIndex: [],
}

export default function reducer(state = initialState, action = {}) {
	let { type, data } = action

	switch(type) {
		case TL_CONTENT_LOADED:

			return {
				...state,
				shellsIndex: data
			}

		default:

			return state
	}

}

export function getShells() {

	return (dispatch) => {

		superagent.get('/api/shells').end((err, res) => {
			dispatch({type: TL_CONTENT_LOADED, data: res.body})
		})

	}

}