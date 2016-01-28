import React from 'react'
import { render } from 'react-dom'
import { Router, Route } from 'react-router'
import history from './utils/history'

import { Deploy } from './pages/deploy'
import { LiveOutput } from './pages/live-output'

class Root extends React.Component {
	render() {
		return <div>{this.props.children}</div>
	}
}

class Forge extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return <Router history={history}>
			<Route path="/" component={Root}>
				<Route path="deploy" component={Deploy} />
				<Route path="shell/:id" component={LiveOutput} />
			</Route>
		</Router>
	}
}

render(<Forge />, document.querySelector('.container'))