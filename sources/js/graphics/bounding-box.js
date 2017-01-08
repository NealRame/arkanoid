import Rect from 'maths/rect';
import Vector from 'maths/vector';

// TODO move the align_center_to_origin parameter as a field into state
export default function BoundingBox(state, align_center_to_origin = false) {
	const origin = align_center_to_origin
		? pos => pos.add({x: -state.size.width/2, y: -state.size.height/2})
		: pos => pos;
	const relative_bbox = Rect(origin(Vector.Null), state.size);
	return {
		boundingBox: {
			get absolute() {
				return Rect(origin(state.position), state.size);
			},
			get relative() {
				return relative_bbox;
			}
		}
	};
}
