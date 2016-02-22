import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Radium from 'radium'

import * as ToasterActions from '../stores/toaster'
import style from '../styles/toaster'

const mapState = (state) => {
	return {
		...state.toaster
	}
}

const actionMap = (dispatch) => {
	return {
		actions: { 
			...bindActionCreators(ToasterActions, dispatch)
		}
	}
}

@connect(mapState, actionMap)
@Radium
export default class ToasterContainer extends Component {
	render() {

		let toast = ""

		if (this.props.showing) {
			toast = <Toast {...this.props}/>
		}

		return <div>
			{toast}
		</div>
	}
}

@Radium
class Toast extends Component {
	render() {

		let symbolClass = ['fa']

		switch (this.props.level) {
			case 'error': 
				symbolClass.push('fa-exclamation')
				break
			case 'warning':
				symbolClass.push('fa-exclamation-triangle')
				break
			case 'success':
				symbolClass.push('fa-check')
				break
			case 'info':
				symbolClass.push('fa-info')
				break
		}

		return <div onClick={this.props.actions.dismiss} style={[style.toast, style.level[this.props.level]]}>
			<div style={style.text}>
				<p style={style.textTitle}>{this.props.text.title}</p>
				<p>{this.props.text.body}</p>
			</div>
			<div style={style.symbol}><i className={symbolClass.join(' ')} /></div>
		</div>
	}
}