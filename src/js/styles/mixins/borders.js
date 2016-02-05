export default function specialBorders(obj, def = {}) {
	return {
		borderTop: obj.top || def,
		borderBottom: obj.bottom || def,
		borderLeft: obj.left || def,
		borderRight: obj.right || def,
	}
}