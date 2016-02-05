import respondTo from './mixins/respondTo'
import specialBorders from './mixins/borders'

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
	header: {
		backgroundColor: '#cfcfcf',
		border: '1px solid #888',
		display: 'flex',
		...width
	},

	title: {
		flex: '1 2 50%',
		fontSize: '1.4em',
		fontWeight: 'bold',
		padding: 5
	},

	status: {
		// flex: '1 3 10%',
		textAlign: 'right',
	},

	_status: {
		common: {
			display: 'block',
			height: '2.4em',
			padding: '0.5em',
			color: '#efefef',
			...respondTo({sm: { backgroundColor: 'transparent', color: 'initial' }})
		},
		failed: {
			backgroundColor: '#c00',
			...respondTo({sm: { color: '#d00' }})
		},
		unknown: {
			backgroundColor: '#00c',
			...respondTo({sm: { color: '#008' }})
		},
		finished: {
			backgroundColor: '#0c0',
			...respondTo({sm: { color: '#080' }})
		},
		running: {
			backgroundColor: '#000'
		}
	},

	statusLabel: {
		...respondTo({sm: { display: 'none' }})
	},

	shell: {
		...width,
		backgroundColor: '#252738',
		color: '#fff',
		padding: 15,
		height: '90vh',
		textShadow: '1px 1px 1px #000',
		...specialBorders({top: '0'}, '1px solid #888'),
	}
}

export default style