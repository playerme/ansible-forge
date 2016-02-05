import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute } from 'react-router'
import { Provider } from 'react-redux'
import Radium, { StyleRoot } from 'radium'
import history from './utils/history'

import Deploy from './ui/deploy'
import Shell from './ui/shell'
import TempList from './ui/temp-list'
import PlaybooksIndex from './ui/playbooks-index'

import store from './store'
import style from './styles/root'

class Root extends React.Component {
	render() {
		return <div style={style.mainContainer}>
			<div style={style.spacerTop}></div>
			<div style={style.content}>{this.props.children}</div>
			<div style={style.spacerBottom}></div>
		</div>
	}
}

Root = Radium(Root)

class DevRuler extends React.Component {
	render() {
		return <div>
			<div key="sm" style={[style.devRuler.shared, style.devRuler.sm]}>SM</div>
			<div key="md" style={[style.devRuler.shared, style.devRuler.md]}>MD</div>
			<div key="lg" style={[style.devRuler.shared, style.devRuler.lg]}>LG</div>
		</div>
	}
}

DevRuler = Radium(DevRuler)

class Forge extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return <StyleRoot>
			<Provider store={store}>
				<Router history={history}>
					<Route path="/" component={Root}>
						<Route path="deploy/:slug" component={Deploy} />
						<Route path="shell/:id" component={Shell} />
						<Route path="playbooks" component={PlaybooksIndex} />
						<Route path="tempshells" component={TempList} />
						<IndexRoute component={PlaybooksIndex} />
					</Route>
				</Router>
			</Provider>
			<DevRuler/>
		</StyleRoot>
	}
}

render(<Forge />, document.querySelector('.container'))