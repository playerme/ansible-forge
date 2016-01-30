import superagent from 'superagent'
import history from '../utils/history'

const OP_TOGGLE = 'deploy.op_toggle'

const DEPLOYING = 'deploy.deploying'

const OPTION_CHANGE = 'deploy.option_change'
const OPTIONS_LOADED = 'deploy.options_loaded'

const initialState = {
	options: {},
	currentlySelected: {},
	optionsPane: false,
	deploying: false,
}

export default function reducer(state = initialState, action = {}) {
	let { type, data } = action

	switch(type) {

		case OP_TOGGLE:

			return {
				...state,
				optionsPane: !state.optionsPane
			}


		case OPTION_CHANGE:

			let newOptions = {}
			Object.assign(newOptions, state.currentlySelected, data)

			return {
				...state,
				currentlySelected: newOptions
			}

		case OPTIONS_LOADED:

			// data will come as [{ flag, default, label, type, description },...]
			let currentlySelected = {}

			data.forEach((opt) => {
				currentlySelected[opt.flag] = opt.default
			})

			return {
				...state,
				options: data,
				currentlySelected,
			}

		case DEPLOYING:

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

	//return (dispatch) => {
		superagent.post('/api/deploy')
		 .send({which: '-i dev-inv test.yml', flags: { superimportant: true }})
		 .end((err, res) => {
			console.log('pushing state')
			history.pushState(null, `/shell/${res.body.id}`)
		})
	//}
}