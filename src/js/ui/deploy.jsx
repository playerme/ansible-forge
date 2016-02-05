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
	componentWillMount() {
		// stopgap for testing
		let opts = [
			{flag: 'superimportant', default: 'yes', label: 'Superimportant Field', type: 'text', description: 'Something that totally needs to be set 100% no decieve'},
			{flag: 'fail', default: true, label: 'Fail', type: 'checkbox', description: 'Should we fail?'},
		]
		this.props.dispatch({type: DEPLOY_OPTIONS_LOADED, data: opts})
	}

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
			<td key={v.flag + '-opt'} style={style.options.option}><input 
				key={v.flag} 
				type={v.type} 
				value={this.props.currentlySelected[v.flag]}
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

	actions(action) {
		let { dispatch, deployActions } = this.props

		let Actions = {
			doDeploy: () => { dispatch(deployActions.doDeploy()) }
		}

		return Actions[action]
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
