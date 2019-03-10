! function(root, factory) {
	const deps = ['classes/Scene', './classes/Cell'];
	const placeOnRoot = true;
	const nameOnRoot = 'creationScene';

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
	const [Scene, Cell] = deps;



	let s;
	let test = new Cell(0, 8, 20, 20);

	const setup = function() {
		// console.log(p5.instance._loop);
		s = 0;
		p5._loop || p5.loop();
	}

	const loop = function() {
		p5.background(255);
		test.draw();
		// console.log(s++);
		// s == 7 && p5.noLoop();
	}

	const term = function() {}


	return new Scene({
		setup,
		loop,
		term
	});



});