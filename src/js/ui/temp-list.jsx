import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Scrollbars } from 'react-custom-scrollbars'
import moment from 'moment'

import * as TempListActions from '../stores/temp-list'

class TempList extends Component {

	componentWillMount() {
		this.props.dispatch(this.props.tempListActions.getShells())
	}

	render() {

		let list = []
		this.props.shellsIndex.forEach((i, k) => list.push(<ShellEntry key={k} {...i} />))

		return <div style={{backgroundColor: '#efefef'}}>
			<Scrollbars>
				<table style={{width: 800, padding: 15}}>
					<tbody>
						<tr><th>Arg List</th><th>State</th><th>Age</th><th>Actions</th></tr>
						{list}
					</tbody>
				</table>
			</Scrollbars>
		</div>
	}

}

export default connect((state) => {
	return {
		...state.tempList,
		tempListActions: TempListActions
	}
})(TempList)

class ShellEntry extends Component {
	render() {
		let { id, args, state, started_at } = this.props

		let center = { textAlign: 'center' }

		return <tr>
			<td>{args}</td>
			<td style={center}>{state}</td>
			<td style={center}>{moment(started_at).fromNow()}</td>
			<td style={center}><Link to={`/shell/${id}`}>[view]</Link></td>
		</tr>
	}
}

