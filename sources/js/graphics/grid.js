import SceneObject from 'graphics/scene-object';

import times from 'lodash.times';

export default function Grid(cols, rows, step, color) {
	return SceneObject(null, {
		onRender(screen) {
			const scale = Math.max(screen.absoluteScale.x, screen.absoluteScale.y);

			screen.pen = {
				strokeStyle: color,
				lineWidth: 1/scale
			};

			screen.save();
			screen.translate({x: .5/scale, y: .5/scale});

				// Vertical guides
				screen.save();
				times(cols, () => {
					screen.translate({x: step, y: 0});
					screen.drawLine({x: 0, y: 0}, {x: 0, y: rows*step});
				});
				screen.restore();

				// Horizontal guides
				screen.save();
				times(rows, () => {
					screen.translate({x: 0, y: step});
					screen.drawLine({x: 0, y: 0}, {x: cols*step, y: 0});
				});
				screen.restore();

			screen.restore();
		},
		position: {x: 0, y: 0},
		size: {
			width: cols*step,
			height: rows*step
		},
		zIndex: -Infinity
	});
}
