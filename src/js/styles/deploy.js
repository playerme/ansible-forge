import specialBorders from './mixins/borders'

import {
	STYLE_PRIMARY,
	STYLE_PRIMARY_HOVER,
} from '../const'

const style = {
	button: {
		backgroundColor: STYLE_PRIMARY,
		padding: '25px 150px',
		color: '#efefef',
		textAlign: 'center',
		textShadow: '0px 1px 1px rgba(0,0,0,0.50)',
		fontSize: '4em',
		fontWeight: 'bold',
		border: '1px solid #182',
		cursor: 'pointer',
		userSelect: 'none',
		':hover': {
			backgroundColor: STYLE_PRIMARY_HOVER,
		}
	},

	label: {
		margin: 0,
		fontSize: '0.8rem'
	},
	
	optionsPane: {
		backgroundColor: '#cfcfcf',
		padding: 10,
		...specialBorders({top: '0'}, '1px solid #888'),
	},

	options: {
		label: {},
		option: {},
		table: {},
	},

	paneToggle: {
		fontWeight: 'bold',
		textAlign: 'center',
		cursor: 'pointer',
		userSelect: 'none',
	},

	paneOpen: {
		display: 'block',
	},

	paneClosed: {
		display: 'none',
	},
}

export default style