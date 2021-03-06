import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Radium from 'radium'

import * as PlaybookActions from '../stores/playbooks'
import style from '../styles/playbooks'


const mapState = (state) => {
	return {
		...state.playbooks
	}
}

const actionMap = (dispatch) => {
	return {
		actions: {
			...bindActionCreators(PlaybookActions, dispatch),
		}
	}
}

@Radium
class PlaybookEntry extends React.Component {

	render() {

		return <tr>
			<td>{this.props.title}</td>
			<td style={style.buttonCell}>
				<Link to={`/playbooks/${this.props.slug}`}>
					<button ref="edit" style={style.editButton}><i className="fa fa-pencil"/></button>
				</Link>
			</td>
			<td style={style.buttonCell}>
				<Link to={`/deploy/${this.props.slug}`}>
					<button ref="go" style={style.goButton}><i className="fa fa-arrow-right"/></button>
				</Link>
			</td>
		</tr>

	}

}

@connect(mapState, actionMap)
@Radium
export default class PlaybookIndex extends React.Component {

	componentWillMount() {
		this.props.actions.fetchPlaybooks()
	}

	render() {
		let playbooks = this.props.playbooks.map((i) => {
			return <PlaybookEntry key={i.id} {...i} />
		})

		return <div style={style.wrapper}>
			<table style={style.table}><tbody>

				<tr><th style={style.headerCell}>Playbooks</th><th></th></tr>

				{playbooks}

				<tr><td colSpan="3">
					<Link to="/playbooks/new">
						<button style={style.newButton}><i className="fa fa-plus" /> New Playbook</button>
					</Link>
				</td></tr>

			</tbody></table>
		</div>
	}

}