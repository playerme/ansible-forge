import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Radium from 'radium'

import * as DeployActions from '../stores/deploy'
import style from '../styles/deploy'

import {
	DEPLOY_OP_TOGGLE,
	DEPLOY_OPTIONS_LOADED,
} from '../const'

const mapState = (state) => {
	return {
		...state.deploy,
	}
}

const actionMap = (dispatch) => {
	return {
		actions: { 
			...bindActionCreators(DeployActions, dispatch),
			optionsPaneToggle: () => { dispatch({ type: DEPLOY_OP_TOGGLE }) }
		}
	}
}

@connect(mapState, actionMap)
@Radium
class DeployOptions extends React.Component {
	

	renderOptions() {
		let options = this.props.options.map((v) => { return <tr key={v.flag} title={v.description}>
			<td key={v.flag + '-label'} style={style.options.label}><label>{v.label}</label></td>
			<td key={v.flag + '-opt'} style={style.options.option}>
			<input 
				key={v.flag} 
				type={v.type} 
				value={this.props.currentlySelected.get(v.flag)}
				checked={this.props.currentlySelected.get(v.flag)}
				onChange={this.props.actions.optionChange.bind(null, {flag: v.flag, type: v.type})} />
			</td></tr> })

		return <table style={style.options.table}><tbody>{options}</tbody></table>
	}

	render() {
		let toggleStyle = (this.props.optionsPane) ? style.paneOpen : style.paneClosed
		return <div style={style.optionsPane}>
			<div style={style.paneToggle} onClick={ this.props.actions.optionsPaneToggle } >Or do something special...</div>
			<div style={[style.paneContent, toggleStyle]}>
				{this.renderOptions()}
			</div>
		</div>
	}
}


@connect(mapState, actionMap)
@Radium
export default class DeployButton extends React.Component {

	componentWillMount() {
		console.log(this.props.actions)

		this.props.actions.loadPlaybook(this.props.params.slug)
	}

	render() {
		return <div>
			<div style={style.button} onMouseUp={this.props.actions.doDeploy.bind(null, this.props.params.slug)}>
				Deploy!
			</div>
			<DeployOptions />
		</div>
	}
}
