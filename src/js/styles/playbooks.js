import respondTo from './mixins/respondTo'

import {
	STYLE_PRIMARY,
	STYLE_PRIMARY_HOVER,
} from '../const'

const width = {
	...respondTo({
		sm: {
			width: '100vw',
		},
		md: {
			width: 665,
		},
		lg: {
			width: 800
		}
	})
}

const style = {
	wrapper: {
		...width,
		backgroundColor: '#cfcfcf',
		padding: 10,
	},
	
	table: {
		width: '100%',
	},

	headerCell: {
		textAlign: 'left',
	},

	buttonCell: {
		textAlign: 'right',
	},

	button: {
		appearance: 'none',
		border: '0',
		backgroundColor: STYLE_PRIMARY,
		padding: '5px 15px',
		// fontWeight: 'bold',
		fontSize: '1em',
		color: '#efefef',
		textAlign: 'center',
		textShadow: '0px 1px 1px rgba(0,0,0,0.50)',
		border: '1px solid #182',
		cursor: 'pointer',
		userSelect: 'none',
		':hover': {
			backgroundColor: STYLE_PRIMARY_HOVER
		}
	},
}

export default style