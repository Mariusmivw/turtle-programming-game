! function(root, factory) {
	const deps = ['classes/Scene', './grid', 'level', 'data'];
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
		// Browser globals (Note: root is often but not always window)
		const ret = factory();
		placeOnRoot && (root[nameOnRoot] = ret);
	}
}('undefined' != typeof window ? window : this, function(...deps) {
	const [Scene, grid, level, data] = deps;



	let cells;

	const setup = function() {
		p5._loop || p5.loop();
		cells = grid.createCells(5, 6, 20, 20);
		console.log(data.grid);
	}

	const loop = function() {
		p5.background(255);
		grid.drawCells(cells);
	}

	const term = function() {
		grid.removeCells(cells);
	}


	return new Scene({
		setup,
		loop,
		term
	});



});