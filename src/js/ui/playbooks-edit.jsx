import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Radium from 'radium'

import * as PlaybookActions from '../stores/playbooks'
import style from '../styles/playbooks'

// const emptyPlaybook = {
// 	title: "",
// 	scheme: "",
// 	slug: "",
// 	requireOptions: false,
// 	options: Set(),
// }

const mapState = (state) => {
	return {
		...state.playbooks,
	}
}

const actionMap = (dispatch) => {
	return {
		actions: {
			...bindActionCreators(PlaybookActions, dispatch),
		}
	}
}

class PlaybookOption extends React.Component {
	// {
	// 	"flag": "branch", 
	// 	"default": "master", 
	// 	"label": "Branch", 
	// 	"type": "text", 
	// 	"description": "Branch to deploy"
	// }

	render() {
		let s = style.edit.options

		return <tr><td colSpan="2">

			<div style={s.wrapper}>

			<div style={s.cell}>
				<label style={s.label}>Flag</label>
				<input value={this.props.flag} onChange={this.props.onChange.bind(null, { which: this.props.flag, field: 'flag' })} />
			</div>

			<div style={s.cell}>
				<label style={s.label}>Label</label>
				<input value={this.props.label} onChange={this.props.onChange.bind(null, { which: this.props.flag, field: 'label' })} />
			</div>

			<div style={s.cell}>
				<label style={s.label}>Description</label>
				<input value={this.props.description} onChange={this.props.onChange.bind(null, { which: this.props.flag, field: 'description' })} />
			</div>

			<div style={s.cell}>
				<label style={s.label}>Type</label>
				<select value={this.props.type || "text"} onChange={this.props.onChange.bind(null, { which: this.props.flag, field: 'type' })}>
					<option value="text">Text</option>
					<option value="checkbox">Toggle</option>
				</select>
			</div>

			<div style={s.cell}>
				<label style={s.label}>Default</label>
				<input 
					type={this.props.type}
					value={this.props.default} 
					checked={this.props.default}
					onChange={this.props.onChange.bind(null, { which: this.props.flag, field: 'default' })} />
			</div>

			<div style={s.removeCell}>
				<button onClick={this.props.onRemove.bind(null, { which: this.props.flag })}>Remove</button>
			</div>

			</div>

		</td></tr>
	}
}

PlaybookOption = Radium(PlaybookOption)

class PlaybookEdit extends React.Component {
	componentWillMount() {
		this.props.actions.fetchOrNewPlaybook(this.props.params.slug)
	}

	render() {
		const s = style.edit
		const A = this.props.activePlaybook
		const OC = this.props.actions.onChange

		let options = A.get('options').map((opt, i) => {
			return <PlaybookOption key={"opt-"+i} {...opt.toObject()} onChange={this.props.actions.onOptionChange} onRemove={this.props.actions.removeOption} />
		})

		return <div style={style.wrapper}>
			<table style={style.table}><tbody>

			<tr>
			<td style={s.title}>Title</td>
			<td style={s.input}>
				<input value={A.get('title')} onChange={OC.bind(null, { which: 'title' })} />
			</td>
			</tr>

			<tr>
			<td style={s.title}>Slug</td>
			<td style={s.input}>
				<input value={A.get('slug')} onChange={OC.bind(null, { which: 'slug' })} />
			</td>
			</tr>

			<tr>
			<td style={s.title}>Scheme</td>
			<td style={s.input}>
				<input value={A.get('scheme')} onChange={OC.bind(null, { which: 'scheme' })} />
			</td>
			</tr>

			<tr>
			<td style={s.title}>Require Options</td>
			<td style={s.input}>
				<input type="checkbox" checked={A.get('requireOptions')} onChange={OC.bind(null, { which: 'requireOptions', type: 'checkbox' })} />
			</td>
			</tr>

			<tr>
			<td style={s.title} colSpan="2">
				Option Builder
			</td>
			</tr>

			{ options }

			<tr>
			<td colSpan="2">
				<button style={s.options.add} onClick={this.props.actions.addBlankOption}>Add Option</button>
			</td>
			</tr>

			</tbody></table>

			<button style={s.save} onClick={this.props.actions.saveOrNewPlaybook.bind(null, this.props.params.slug)}>Save</button>
		</div>
	}
}

PlaybookEdit = Radium(PlaybookEdit)
export default connect(mapState, actionMap)(PlaybookEdit)