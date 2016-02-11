import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Radium from 'radium'
import moment from 'moment'

import * as ShellIndexActions from '../stores/shell-index'
import style from '../styles/shell-index'

const mapState = (state) => {
	return {
		...state.shellIndex,
	}
}

const actionMap = (dispatch) => {
	return {
		actions: {
			...bindActionCreators(ShellIndexActions, dispatch),
		}
	}
}

@Radium
class ShellEntry extends React.Component {

	render() {
		let state = <div style={[style.stateCommon, style.state[this.props.state]]}>{this.props.state}</div>

		return <tr>
			<td style={style.bigCell}>{this.props.playbook}</td>
			<td style={{whiteSpace: 'nowrap'}}>
				{moment(this.props.started_at).fromNow()}</td>
			<td>{state}</td>
			<td style={style.buttonCell}><Link to={`/shell/${this.props.id}`}><button style={style.button}>View</button></Link></td>
		</tr>

	}

}

ShellEntry = Radium(ShellEntry)

class ShellIndex extends React.Component {

	componentWillMount() {
		this.props.actions.fetchShells()
	}

	render() {
		let shells = this.props.shells.map((i) => {
			return <ShellEntry key={i.id} {...i} />
		})

		return <div style={style.wrapper}>
			<table style={style.table}><tbody>

				<tr><th style={style.headerCell}>Shells</th><th></th><th></th></tr>

				{shells}

			</tbody></table>
		</div>
	}

}

ShellIndex = Radium(ShellIndex)
export default connect(mapState, actionMap)(ShellIndex)