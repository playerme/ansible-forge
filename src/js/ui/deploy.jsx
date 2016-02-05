import React from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'

import * as DeployActions from '../stores/deploy'
import style from '../styles/deploy'

import {
	DEPLOY_OP_TOGGLE,
	DEPLOY_OPTIONS_LOADED,
} from '../const'

class DeployOptions extends React.Component {
	actions(action, extra) {
		let { dispatch, deployActions } = this.props

		let Actions = {
			optionChange: (event) => { dispatch(deployActions.optionChange(extra, event)) },
			optionsPaneToggle: (...args) => { dispatch({type: DEPLOY_OP_TOGGLE}) },
		}

		return Actions[action]
	}

	renderOptions() {
		//<input value={this.props.currentlySelected.superimportant} onChange={this.actions('optionChange', 'superimportant')} />
		let options = this.props.options.map((v) => { return <tr key={v.flag} title={v.description}>
			<td key={v.flag + '-label'} style={style.options.label}><label>{v.label}</label></td>
			<td key={v.flag + '-opt'} style={style.options.option}>
			<input 
				key={v.flag} 
				type={v.type} 
				value={this.props.currentlySelected.get(v.flag)}
				checked={this.props.currentlySelected.get(v.flag)}
				onChange={this.actions('optionChange', {flag: v.flag, type: v.type})} />
			</td></tr> })

		return <table style={style.options.table}><tbody>{options}</tbody></table>
	}

	render() {
		let toggleStyle = (this.props.optionsPane) ? style.paneOpen : style.paneClosed
		return <div style={style.optionsPane}>
			<div style={style.paneToggle} onClick={ this.actions('optionsPaneToggle') } >Or do something special...</div>
			<div style={[style.paneContent, toggleStyle]}>
				{this.renderOptions()}
			</div>
		</div>
	}
}

DeployOptions = Radium(DeployOptions)
DeployOptions = connect((state) => {
	return {
		...state.deploy,
		deployActions: DeployActions,
	}
})(DeployOptions)


class DeployButton extends React.Component {
	actions(action, extra) {
		let { dispatch, deployActions, params: { slug } } = this.props

		let Actions = {
			doDeploy: () => { dispatch(deployActions.doDeploy(slug)) },
			loadPlaybook: () => { dispatch(deployActions.loadPlaybook(slug)) }
		}

		return Actions[action]
	}

	componentWillMount() {
		this.actions('loadPlaybook')()
	}

	render() {
		return <div>
			<div style={style.button} onMouseUp={this.actions('doDeploy')}>
				Deploy!
			</div>
			<DeployOptions />
		</div>
	}
}

DeployButton = Radium(DeployButton)
export default connect((state) => {
	return {
		...state.deploy,
		deployActions: DeployActions,
	}
})(DeployButton)
