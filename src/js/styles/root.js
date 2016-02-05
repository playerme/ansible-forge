import respondTo from './mixins/respondTo'

const style = {

	mainContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		...respondTo({ sm: { padding: 0 } }, { padding: 15 })
	},

	content: {
		// maxWidth: '50%', 
		// height: '100%',
		...respondTo({ sm: { width: '100vw' } })
	},

	spacerTop: {
		alignSelf: 'flex-start',
		// ...respondTo({
		// 	sm: {
		// 		display: 'none'
		// 	}
		// })
	},

	spacerBottom: {
		alignSelf: 'flex-end',
		// ...respondTo({
		// 	sm: {
		// 		display: 'none'
		// 	}
		// })
	},

	devRuler: {
		shared: {
			fontFamily: 'monospace',
			padding: 10,
			position: 'fixed',
			bottom: 0,
			right: 0,
			color: 'white',
		},
		sm: {
			...respondTo({sm: { display: 'block' }}, { display: 'none' }),
			backgroundColor: 'red'
		},
		md: {
			...respondTo({md: { display: 'block' }}, { display: 'none' }),
			backgroundColor: 'purple'
		},
		lg: {
			...respondTo({lg: { display: 'block' }}, { display: 'none' }),
			backgroundColor: 'blue'
		}
	}

}

export default style