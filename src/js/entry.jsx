import React from 'react'
import { render } from 'react-dom'
import { Router } from 'react-router'
import { ForgeBase, routes } from './forge'
import history from './utils/history'
import store from './store'

class ForgeEntry extends React.Component {
	render() {
		return <ForgeBase store={store}>
			<Router history={history}>
				{routes}
			</Router>
		</ForgeBase>
	}
}

render(<ForgeEntry />, document.getElementsByClassName('container')[0])