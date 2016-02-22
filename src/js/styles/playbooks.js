import respondTo from './mixins/respondTo'
import button from './mixins/button'

import {
	STYLE_PRIMARY,
	STYLE_PRIMARY_HOVER,
	STYLE_WARN
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
		width: '100%',
	},

	buttonCell: {
		textAlign: 'right',
	},

	goButton: {
		...button(STYLE_PRIMARY, '#182', STYLE_PRIMARY_HOVER),
	},

	newButton: {
		...button('#15f', '#138', '#24a'),
	},

	editButton: {
		...button(STYLE_WARN, '#860', '#a60'),
	},

	edit: {

		title: {
			fontWeight: 'bold',
			whiteSpace: 'nowrap',
		},

		input: {
			width: '100%',
		},

		save: {
			...button(STYLE_PRIMARY, '#182', STYLE_PRIMARY_HOVER),
			marginLeft: 3
		},

		delete: {
			...button('#f30', '#c00', '#c44'),
		},

		options: {
			wrapper: {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			},

			label: {
				display: 'block',
			},

			cell: {
				flex: '1 1 100%',
				textAlign: 'center',
				fontSize: '0.8em'
			},

			removeCell: {},

			removeButton: {
				...button('#f30', '#c00', '#c44'),
				fontSize: '0.8em',
				padding: 5
			},

			add: {
				...button('#15f', '#138', '#24a'),
				fontSize: '0.8em',
				padding: 5,
				margin: '5px 0'
			},


		}

	},
}

export default style