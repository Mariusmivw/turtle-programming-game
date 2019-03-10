! function(root, factory) {
	const deps = [];
	const placeOnRoot = true;
	const nameOnRoot = 'Scene';

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



	return class Scene {
		constructor(init = function() {}, loop = function() {}, term = function() {}, scope) {
			if (typeof(init) == 'object') {
				loop = init.loop || init.draw || init[1] || function() {};
				term = init.term || init.end || init[2] || function() {};
				scope = init.scope || arguments[1];
				init = init.init || init.setup || init[0] || function() {};
			}

			this.init = scope ? (...args) => {
				init.apply(scope, args)
			} : init;
			this.loop = scope ? (...args) => {
				loop.apply(scope, args)
			} : loop;
			this.term = scope ? (...args) => {
				term.apply(scope, args)
			} : term;
		}

		set setup(val) {
			this.init = val;
		}
		get setup() {
			return this.init;
		}

		set draw(val) {
			this.loop = val;
		}
		get draw() {
			return this.loop;
		}

		set end(val) {
			this.term = val;
		}
		get end() {
			return this.term;
		}
	}



});