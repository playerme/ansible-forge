import React from 'react'
import { connect } from 'react-redux'

import * as DeployActions from '../reducers/deploy'

class DeployButton extends React.Component {

	render() {
		return <div className="deploy-button">
			<div className="deploy-button--big-green-button™" onMouseUp={this.props.deployActions.doDeploy}>
				Deploy!
			</div>
			<DeployOptions {...this.props} />
		</div>
	}
}

export default connect((state) => {
	return {
		...state.deploy,
		deployActions: DeployActions,
	}
})(DeployButton)

class DeployOptions extends React.Component {
	render() {
		let paneClass = [
			"deploy-button--options--pane",
		]

		if (this.props.optionPane) {
			paneClass.push('opened')
		} else {
			paneClass.push('closed')
		}

		return <div className="deploy-button--options">
			<div onClick={() => this.props.dispatch({type: 'deploy.op_toggle'})}>Or do something special...</div>
			<div className={paneClass.join(' ')}>
				the pane
			</div>
		</div>
	}
}

class Option extends React.Component {
	renderText() {
		return <div><label>{this.props.name}</label> <input value={this.props.value} onBlur={this.props.onChange} /></div>
	}

	renderToggle() {
		return <div><label>{this.props.name}</label> <input type="checkbox" value={this.props.value} onChange={this.props.onChange} /> </div>
	}

	render() {
		switch(this.props.type) {
			case 'toggle': return renderToggle(); break;
			case 'text': return renderText(); break;
		}
	}
}

