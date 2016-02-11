import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Radium from 'radium'
import { Scrollbars } from 'react-custom-scrollbars'
import ansi from 'ansi_up'

import * as ShellActions from '../stores/shell'
import style from '../styles/shell'


const mapState = (state) => {
	return {
		...state.shell,
	}
}

const actionMap = (dispatch) => {
	return {
		actions: {
			...bindActionCreators(ShellActions, dispatch),
		}
	}
}

@connect(mapState, actionMap)
@Radium
export default class Shell extends React.Component {

	componentWillMount() {
		this.props.actions.loadShell(this.props.params.id)
	}

	componentDidMount() {
		this.props.actions.listenToShell(this.props.params.id)
	}

	componentWillUnmount() {
		this.props.actions.unloadShell()
	}

	componentDidUpdate() {
		this.refs.scrollbars.scrollToBottom()
	}

	render() {
		let status = <div style={[style._status.common, style._status[this.props.status]]}><label>Waiting&nbsp;</label><i className="fa fa-question" /></div>

		switch(this.props.status) {
			case 'running': status = <div style={[style._status.common, style._status[this.props.status]]}><label style={style.statusLabel}>Running&nbsp;</label><i className="fa fa-spinner fa-spin"/></div>; break
			case 'failed': status = <div style={[style._status.common, style._status[this.props.status]]}><label style={style.statusLabel}>Failed&nbsp;</label><i className="fa fa-times"/></div>; break
			case 'finished': status = <div style={[style._status.common, style._status[this.props.status]]}><label style={style.statusLabel}>Done&nbsp;</label><i className="fa fa-check" /></div>; break
		}


		return <div className="live-output">
			<div style={style.header}>
				<div style={style.title}>Doing live output test....</div>
				<div style={style.status}>{status}</div>
			</div>
			<div style={style.shell}>
				<Scrollbars ref="scrollbars">
					<ANSI>{this.props.data}</ANSI>
				</Scrollbars>
			</div>
		</div>
	}
}

class ANSI extends React.Component {
	render() {
		let text = this.props.children

		let spookyDangerousHTML = { __html: ansi.ansi_to_html(text) }

		return <pre dangerouslySetInnerHTML={spookyDangerousHTML}/>
	}
}