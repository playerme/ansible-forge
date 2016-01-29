import React from 'react'
import superagent from 'superagent'
import history from '../utils/history'

export class Deploy extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			opened: false, //ignoring this for now
			config: {},
		}

		let mockConfig = [
			{ name: "branch", type: "text", default: "master" },
			{ name: "build_branch", type: "text" },
			{ name: "skip_build", type: "toggle", default: false },
			{ name: "skip_migrations", type: "toggle", default: false },
			{ name: "only_deploy", type: "toggle", default: true },
			{ name: "private", type: "toggle", default: false },
			{ name: "remove", type: "toggle", default: false },
		]

		this.props = {
			configOptions: mockConfig,
		}
	}

	setConfig(data) {
		this.setState({config: data})
	}	

	render() {
		return <div>
			<DeployButton {...this.props} {...this.state} setConfig={this.setConfig} />
		</div>
	}
}

class DeployButton extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			deploying: false
		}
	}

	render() {
		return <div className="deploy-button">
			<div className="deploy-button--big-green-button™" onMouseDown={this.doDeploy.bind(this)}>
				Deploy!
			</div>
			<DeployOptions {...this.props.config} />
		</div>
	}

	doDeploy() {

		if (this.state.deploying) {
			return;
		}

		this.setState({deploying: true})
		console.log('doing deploy')
		superagent.post('/api/deploy').send({which: "-i dev-inv test.yml", flags: { superimportant: { "foo": "bar", "quux": "koo" } }}).end((err, data) => {
			
			this.setState({deploying: false})	

			if (err !== null) {
				throw err
			}

			history.pushState(null, '/shell/'+data.body.id)

		})
	}
}

class DeployOptions extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			opened: props.opened,
			config: props.config,
		}
	}

	setConfig(data) {
		this.props.setConfig(data)
	}

	render() {
		let paneClass = 'closed'

		if (this.state.opened) {
			paneClass = 'opened'
		}

		return <div className="deploy-button--options">
			<div onClick={this.setState.bind(this, {opened: !this.state.opened})}>Or do something special...</div>
			<div className="deploy-button--options--pane deploy-button--options--pane_{paneClass}">
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