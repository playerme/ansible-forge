import { combineReducers } from 'redux'

import liveOutput from './reducers/live-output'
import deploy from './reducers/deploy'
import tempList from './reducers/temp-list'

export default combineReducers({
	liveOutput,
	deploy,
	tempList
})