import specialBorders from './mixins/borders'

const style = {
	button: {
		backgroundColor: '#15C822',
		padding: '25px 150px',
		color: '#efefef',
		textAlign: 'center',
		textShadow: '0px 1px 1px rgba(0,0,0,0.50)',
		fontSize: '4em',
		fontWeight: 'bold',
		border: '1px solid #182',
		cursor: 'pointer',
		userSelect: 'none',
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