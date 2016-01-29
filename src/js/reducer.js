import { combineReducers } from 'redux'

import liveOutput from './reducers/live-output'
import deploy from './reducers/deploy'

export default combineReducers({
	liveOutput,
	deploy,
})