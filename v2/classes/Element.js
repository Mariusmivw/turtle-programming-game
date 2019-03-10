! function(root, factory) {
	const deps = [];
	const placeOnRoot = true;
	const nameOnRoot = 'Element';

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




	return class Element {
		constructor(settings) {
			this.x = settings.x;
			this.y = settings.y;
			this.w = settings.w || settings.width;
			this.h = settings.h || settings.height;
			this.draw = settings.draw || settings.loop || (() => {});
			this.onremove = settings.remove || settings.rem || settings.delete || settings.del || settings.onremove || settings.onrem || settings.ondelete || settings.ondel || (() => {});

			this.elt = this.element = document.createElement(settings.tag || 'div');
			this.elt.style.position = 'absolute';
			this.elt.style.left = this.x;
			this.elt.style.top = this.y;
			this.elt.style.width = this.w;
			this.elt.style.height = this.h;

			for (const ev in settings.events) {
				if (Array.isArray(settings.events[ev])) {
					for (const fn of settings.events[ev]) {
						this.elt.addEventListener(ev, fn);
					}
				} else {
					this.elt.addEventListener(ev, settings.events[ev]);
				}
			}

			(settings.parent || settings.parentElt || document.documentElement).appendChild(this.elt);

			(settings.setup || settings.init || (() => {})).apply(this);
		}

		remove() {
			this.onremove();
			this.elt.remove();
		}
	}



});