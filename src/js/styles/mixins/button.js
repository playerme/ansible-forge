export default function button(mainColor, borderColor, hoverColor) {
	return {
		appearance: 'none',
		backgroundColor: mainColor,
		padding: '5px 15px',
		fontSize: '1em',
		color: '#efefef',
		textAlign: 'center',
		textShadow: '0px 1px 1px rgba(0,0,0,0.50)',
		border: `1px solid ${borderColor}`,
		userSelect: 'none',
		':hover': {
			backgroundColor: hoverColor
		}
	}
}