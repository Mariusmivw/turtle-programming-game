! function(root, factory) {
	const deps = ['classes/Scene', 'classes/Element'];
	const placeOnRoot = true;
	const nameOnRoot = 'playScene';

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
	const [Scene, Element] = deps;



	let s;

	const setup = function() {
		// console.log(p5.instance._loop);
		s = 0;
		p5._loop || p5.loop();
	}

	const loop = function() {
		console.log(s++);
		s == 4 && p5.noLoop();
	}

	const term = function() {}


	return new Scene({
		setup,
		loop,
		term
	});



});