import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'
import atohLib from 'ansi-to-html'
import { Scrollbars } from 'react-custom-scrollbars';

const atoh = new atohLib()

export class LiveOutput extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			data: "",
			status: 'unknown'
		}
	}

	componentDidMount() {
		let self = this

		let s = this.socket = io('/shell/'+this.props.params.id)
		
		s.on('shell', (data) => {
			console.log('shell socket data\n',data)

			switch(data.type) {
				case 'progress':
					let last = self.state.data;
					self.setState({data: last+data.data})
					break
				case 'start':
					self.setState({status: 'running'})
					break
				case 'end':
					self.setState({status: 'finished'})
					break
				case 'error':
					self.setState({status: 'failed'})
					break
			}

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
}

class Shell extends React.Component {
	render() {
		let text = this.props.children

		let spookyDangerousHTML = { __html: atoh.toHtml(text) }

		return <pre dangerouslySetInnerHTML={spookyDangerousHTML}/>
	}
}