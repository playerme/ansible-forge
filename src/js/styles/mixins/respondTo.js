import {
	STYLE_BREAK_SM,
	STYLE_BREAK_LG
} from '../../const'

export default function respondTo(obj, def = {}) {
	let out = {}
		
	out[`@media (max-width: ${STYLE_BREAK_SM - 1}px)`] = obj.sm || def
	out[`@media (min-width: ${STYLE_BREAK_SM}px) and (max-width: ${STYLE_BREAK_LG - 1}px)`] = obj.md || def
	out[`@media (min-width: ${STYLE_BREAK_LG}px)`] = obj.lg || def

	return out
}