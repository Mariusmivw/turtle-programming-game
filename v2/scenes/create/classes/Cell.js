! function(root, factory) {
	const deps = ['classes/Element', 'data'];
	const placeOnRoot = true;
	const nameOnRoot = 'Cell';

	if (typeof define === 'function' && define.amd) {
		// AMD
		define(deps, factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		const args = [];
		for (const dep in deps) {
			args.push(require(dep));
		}
		module.exports = factory.apply(this, args);
	} else {
		// Browser globals (Note: root is not always window)
		const ret = factory();
		placeOnRoot && (root[nameOnRoot] = ret);
	}
}('undefined' != typeof window ? window : this, function(...deps) {
	const [Element, data] = deps;


	return class Cell extends Element {
		constructor(x_i, y_i, w, h, settings) {
			const onMousedown = settings && settings.mousepressed || ((first) => {
				data.grid[this.y_i][this.x_i] = data.color;
			});

			super({
				tag: 'cell',
				x: x_i * w + (data.xOffset || 0),
				y: y_i * h + (data.yOffset || 0),
				w,
				h,
				draw: settings && settings.draw || (() => {
					p5.push();
					p5.noStroke();
					p5.fill((this.isHoverCell() && data.color || data.grid[y_i][x_i]) * 255);
					p5.rect(this.x, this.y, this.w, this.h);
					p5.pop();
				}),
				events: {
					'mousedown': (...args) => {
						onMousedown.apply(this, [true].concat(args));
					},
					'mouseover': settings && settings.mouseover || ((...args) => {
						if (p5.mouseIsPressed) {
							onMousedown.apply(this, [false].concat(args));
						} else {
							data.hoverCell = [this.x_i, this.y_i];
						}
					}),
					'mouseout': settings && settings.mouseover || (() => {
						data.hoverCell = false;
					}),
					'dragstart': settings && settings.events.drag || ((e) => {
						e.preventDefault();
					})
				}
			});

			this.x_i = x_i;
			this.y_i = y_i;
		}

		isHoverCell() {
			return this.x_i == data.hoverCell[0] && this.y_i == data.hoverCell[1];
		}
	}



});