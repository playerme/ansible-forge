import { combineReducers } from 'redux'
import { routeReducer } from 'react-router-redux'

import shell from './stores/shell'
import deploy from './stores/deploy'
import playbooks from './stores/playbooks'
import shellIndex from './stores/shell-index'

import toaster from './stores/toaster'

export default combineReducers({
	shell,
	deploy,
	playbooks,
	shellIndex,

	toaster,

	routing: routeReducer,
})