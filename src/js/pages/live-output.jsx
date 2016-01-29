import React from 'react'
import { connect } from 'react-redux'
import ansi from 'ansi_up'
import { Scrollbars } from 'react-custom-scrollbars'

import * as LiveOutputActions from '../reducers/live-output'

class LiveOutput extends React.Component {

	componentWillMount() {
		const { dispatch, liveOutputActions: { loadShell }, params: { id } } = this.props

		dispatch( loadShell(id) )
	}

	componentDidMount() {
		const { dispatch, liveOutputActions: { listenToShell }, params: { id } } = this.props

		dispatch( listenToShell(id) )
	}

	componentWillUnmount() {
		const { dispatch } = this.props
		
		dispatch( { type: 'shell.unloaded' } )
	}

	componentDidUpdate() {
		this.refs.scrollbars.scrollToBottom()
	}

	render() {
		let status = <label className="status--unknown">Waiting &nbsp;<i className="fa fa-question" /></label>

		switch(this.props.status) {
			case 'running': status = <label className="status--running">Running&nbsp;<i className="fa fa-spinner fa-spin"/></label>; break
			case 'failed': status = <label className="status--failed">Failed&nbsp;<i className="fa fa-times"/></label>; break
			case 'finished': status = <label className="status--finished">Done&nbsp;<i className="fa fa-check" /></label>; break
		}


		return <div className="live-output">
			<div className="live-output--header">
				<div className="live-output--header--text">Doing live output test....</div>
				<div className="live-output--header--status">{status}</div>
			</div>
			<div className="live-output--content">
				<Scrollbars ref="scrollbars">
					<Shell>{this.props.data}</Shell>
				</Scrollbars>
			</div>
		</div>
	}
}

class Shell extends React.Component {
	render() {
		let text = this.props.children

		let spookyDangerousHTML = { __html: ansi.ansi_to_html(text) }

		return <pre dangerouslySetInnerHTML={spookyDangerousHTML}/>
	}
}

export default connect((state) => {
	return {
		data: state.liveOutput.data,
		status: state.liveOutput.status,
		liveOutputActions: LiveOutputActions,
	}
})(LiveOutput)