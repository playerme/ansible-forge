import { combineReducers } from 'redux'

import shell from './stores/shell'
import deploy from './stores/deploy'
import tempList from './stores/temp-list'
import playbooks from './stores/playbooks'
import shellIndex from './stores/shell-index'

export default combineReducers({
	shell,
	deploy,
	tempList,
	playbooks,
	shellIndex,
})