import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Radium from 'radium'

import * as PlaybookActions from '../stores/playbooks'
import style from '../styles/playbooks'

class PlaybookEntry extends React.Component {

	render() {

		return <tr>
			<td>{this.props.title}</td><td style={style.buttonCell}><Link to={`/deploy/${this.props.slug}`}><button style={style.button}>Go</button></Link></td>
		</tr>

	}

}

PlaybookEntry = Radium(PlaybookEntry)

class PlaybookIndex extends React.Component {

	actions(action) {
		let { dispatch, playbookActions } = this.props	

		let Actions = {
			fetchPlaybooks: () => { dispatch(playbookActions.fetchPlaybooks()) },
		}

		return Actions[action]
	}

	componentWillMount() {
		this.actions('fetchPlaybooks')()
	}

	render() {
		let playbooks = this.props.playbooks.map((i) => {
			return <PlaybookEntry key={i.id} {...i} />
		})

		return <div style={style.wrapper}>
			<table style={style.table}><tbody>

				<tr><th style={style.headerCell}>Playbooks</th><th></th></tr>

				{playbooks}

			</tbody></table>
		</div>
	}

}

PlaybookIndex = Radium(PlaybookIndex)
export default connect((state) => {
	return {
		...state.playbooks,
		playbookActions: PlaybookActions
	}
})(PlaybookIndex)