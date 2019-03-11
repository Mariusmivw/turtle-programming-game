! function(root, factory) {
	const deps = ['./classes/Cell', 'data'];
	const placeOnRoot = true;
	const nameOnRoot = 'grid';

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
	const [Cell, data] = deps;
	// const global = this;



	function createCells(horizontal, vertical, width, height) {
		const resetGrid = !Boolean(data.grid);
		const cells = [];
		resetGrid && (data.grid = []);
		for (let j = 0; j < vertical; j++) {
			const r = [];
			resetGrid && data.grid.push([]);
			for (let i = 0; i < horizontal; i++) {
				r.push(new Cell(i, j, width, height))
				resetGrid && data.grid[j].push(0)
			}
			cells.push(r);
		}
		return cells;
	}

	function drawCells(cells, withLines = true) {
		p5.push();
		for (const r of cells) {
			for (const cell of r) {
				cell.draw();
			}
		}
		if (withLines) {
			const x = data.xOffset || 0;
			const y = data.yOffset || 0;
			for (let i = 0; i <= cells.length; i++) {
				p5.line(x, y + i * cells[0][0].h, x + cells[0][0].w * cells[0].length, y + i * cells[0][0].h);
			}
			for (let j = 0; j <= cells[0].length; j++) {
				p5.line(x + j * cells[0][0].w, y, x + j * cells[0][0].w, y + cells[0][0].h * cells.length);
			}
		}
		p5.pop();
	}

	function removeCells(cells) {
		for (const r of cells) {
			for (const cell of r) {
				cell.remove();
			}
		}
	}

	return {
		createCells,
		drawCells,
		removeCells,
		data: undefined
	};



});