! function(root, factory) {
	const deps = ['classes/Element'];
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
	const [Element] = deps;


	return class Cell extends Element {
		constructor(x, y, w, h, settings) {
			let color = 255;
			super({
				x,
				y,
				w,
				h,
				draw: settings && settings.draw || (() => {
					p5.push();
					p5.fill(color);
					p5.rect(this.x, this.y, this.w, this.h);
					p5.pop();
				}),
				events: {
					'mouseover': settings && settings.mouseover || (() => {
						color = [255, 0, 0];
					}),
					'mouseout': settings && settings.mouseover || (() => {
						color = 255;
					})
				}
			});
		}
	}



});