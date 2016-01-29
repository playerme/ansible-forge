import React from 'react'
import ReactDOM from 'react-dom'
import atohLib from 'ansi-to-html'
import io from 'socket.io-client'
import superagent from 'superagent' 

import { Scrollbars } from 'react-custom-scrollbars';

const atoh = new atohLib()

export class LiveOutput extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			data: "",
			status: 'unknown'
		}

		superagent.get(`/api/shell/${this.props.params.id}`).end((err, data) => {
			data.body.frames.forEach(frame => this.processData(frame))
		})
	}

	componentDidMount() {
		let self = this

		let s = this.socket = io('/shell/'+this.props.params.id)
		
		s.on('shell', (data) => {
			console.log('shell socket data\n',data)

			this.processData(data)

		})
			
	}

	componentDidUpdate() {
		this.refs.scrollbars.scrollToBottom()
	}

	componentWillUnmount() {
		this.socket.disconnect()
	}

	render() {
		let status = <label className="status--unknown">Waiting &nbsp;<i className="fa fa-question" /></label>

		switch(this.state.status) {
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
					<Shell>{this.state.data.trim()}</Shell>
				</Scrollbars>
			</div>
		</div>
	}

	processData(data) {
		switch(data.type) {
			case 'start':
				this.setState({status: 'running'})
			case 'progress':
				let last = this.state.data;
				this.setState({data: last+data.data})
				break
			case 'end':
				this.setState({status: 'finished'})
				break
			case 'error':
				this.setState({status: 'failed'})
				break
		}
	} 
}

class Shell extends React.Component {
	render() {
		let text = this.props.children

		let spookyDangerousHTML = { __html: atoh.toHtml(text) }

		return <pre dangerouslySetInnerHTML={spookyDangerousHTML}/>
	}
}