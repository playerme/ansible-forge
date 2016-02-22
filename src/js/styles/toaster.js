import {
	STYLE_DARK,
	STYLE_TEXT_LIGHT,
} from '../const'

const style = {
	toast: {
		position: 'fixed',
		backgroundColor: STYLE_DARK,
		color: '#fff',
		zIndex: 1000,
		padding: '5px 20px',
		borderRadius: 3,
		bottom: 10,
		right: 10,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',

		':hover': {
			boxShadow: '0 0 3px rgba(0,10,50,0.3)'
		}
	},

	level: {
		error: {
			border: '1px solid #f00',
			color: '#f00'
		},
		success: {
			border: '1px solid #0f0',
			color: '#0f0'
		},
		warning: {
			border: '1px solid #fa0',
			color: '#fa0',
		},
		info: {
			border: '1px solid #0af',
			color: '#0af',
		}
	},

	text: {
		color: STYLE_TEXT_LIGHT,
		flex: '2 3 100%',
	},

	textTitle: {
		fontWeight: 'bold',
	},

	symbol: {
		flex: '1',
		marginLeft: 15,
		fontSize: '2em',
	}
}

export default style