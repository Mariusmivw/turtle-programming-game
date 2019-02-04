const gridSize = 600;
const menuWidth = 251;
const cells = 10;
const cellSize = gridSize / cells;
let colors;
let selectedColor;
const settings = {
	grid: [],
	fonctions: [],
	colors: 3,
	pos: [0, 0, 0]
};
let fonctions = [];
let selectedFonction = [0, 0];

function setup() {
	const c = createCanvas(gridSize + menuWidth, gridSize + 1).elt;
	document.getElementById('canvasContainer').append(c);
	loadGrid('N4Ig5gTglgJiBcBtRAGANOzHtcwXTVTQEY0AWcyi6ylAo03HbAZg3vUeabbsM+6DeHEoJ7t+opuL4MxzYZIBMaFWtUaViotPl0CIAMYB7ADbGIAZwQUQAB2PWkpFwYBmxgHaGALlC9OiAAcaCFheAC+QA===')
}

function draw() {
	background(255);
	drawGrid();
	drawMenu();
}

function drawGrid() {
	for (let i = 0; i <= cells; i++) {
		line(i * cellSize, 0, i * cellSize, gridSize);
		line(0, i * cellSize, gridSize, i * cellSize);
	}

	for (let i = 0; i < settings.grid.length; i++) {
		for (let u = 0; u < settings.grid[i].length; u++) {
			if (settings.grid[i][u]) {
				drawGridCell(i, u, settings.grid[i][u]);
			}
		}
	}

	push();
	translate(30 + 60 * settings.pos[0], 30 + 60 * settings.pos[1]);
	rotate(PI / 2 * settings.pos[2]);
	triangle(0, 0, -20, 20, 20, 20);
	pop();
}

function drawGridCell(x, y, c) {
	push();
	colorMode(HSL);
	fill((360 / settings.colors) * (c - 1), 57, 50);
	rect(x * cellSize, y * cellSize, cellSize, cellSize);
	pop();
}

function drawMenu() {
	const rectSize = 20;
	const spacing = 5;
	let x;
	let y;

	// draw colors
	push();
	rectMode(CENTER);
	colorMode(HSL);
	x = gridSize - rectSize / 2;
	y = rectSize / 2;
	for (let i = 0; i < settings.colors; i++) {
		x += rectSize + spacing;
		if (x > gridSize + menuWidth - rectSize / 2) {
			y += rectSize + spacing;
			x = gridSize + rectSize / 2 + spacing;
		}
		fill((360 / settings.colors) * i, 57, 50);
		rect(x, y, rectSize, rectSize);
	}
	if (mouseIsPressed) {
		const h = floor((mouseX - gridSize) / (rectSize + spacing)) + 1;
		const v = floor((mouseY - rectSize - spacing) / (rectSize + spacing)) + 1;
		if (
			(mouseX - gridSize) % (rectSize + spacing) > spacing &&
			mouseY % (rectSize + spacing) < rectSize
		) {
			const c = v * floor(menuWidth / (rectSize + spacing)) + h;
			selectedColor = c > settings.colors || c < 1 ? selectedColor : c;
		}
	}
	pop();

	// draw directives
	push();
	rectMode(CENTER);
	x = gridSize + rectSize / 2 + spacing;
	y += (rectSize + spacing) * 2;
	let directivesY = y;
	push();
	translate(x, y);
	for (let i = 0; i < 3; i++) {
		rect(0, 0, rectSize, rectSize);
		push();
		rotate(PI / 2 * (i - 1));
		triangle(0, 0, -rectSize / 3, rectSize / 3, rectSize / 3, rectSize / 3);
		pop();
		translate(rectSize + spacing, 0);
	}
	pop();
	pop();

	// draw Fonctions
	push();
	rectMode(CENTER);
	x = gridSize + rectSize / 2 + spacing;
	y += (rectSize + spacing) * 2;
	let fonctionsY = y;
	textSize(rectSize / 1.25);
	text('Fonctions:', x - textSize() + spacing, y + rectSize / 2 - textSize() / 4);
	for (let i = 0; i < settings.fonctions.length; i++) {
		x = gridSize + rectSize / 2 + spacing;
		y += rectSize + spacing;
		text('F' + (i + 1).toString(), x - textSize() + spacing, y + rectSize / 2 - textSize() / 4);
		for (let u = 0; u < settings.fonctions[i]; u++) {
			x += rectSize;

			let c = false;
			try {
				if (typeof(fonctions[i][u][1]) == 'number') {
					const h = fonctions[i][u][1] * 360 / settings.colors;
					push();
					colorMode(HSL);
					fill(h, 57, 50);
					c = true;
				}
			} catch {}

			rect(x, y, rectSize, rectSize);

			if (c) pop();

			let d = false;
			try {
				if (typeof(fonctions[i][u][0]) == 'number') {
					push();
					translate(x, y);
					rotate(PI / 2 * (fonctions[i][u][0] - 1));
					triangle(0, 0, -rectSize / 3, rectSize / 3, rectSize / 3, rectSize / 3);
					d = true;
				}
			} catch {}

			if (d) pop();
		}
	}
	push();
	noFill();
	stroke(255, 0, 0);
	strokeWeight(2);
	rect(gridSize + rectSize / 2 + spacing + rectSize * (selectedFonction[1] + 1), fonctionsY + (rectSize + spacing) * (selectedFonction[0] + 1), rectSize, rectSize);
	pop();
	pop();

	if (mouseIsPressed) {
		// Fonctions
		const fh = floor((mouseX - gridSize - rectSize - spacing) / rectSize);
		const ftv = mouseY - fonctionsY - rectSize / 2;
		const fv = floor(ftv / (rectSize + spacing));
		// colors
		const cth = mouseX - gridSize;
		const ch = floor(cth / (rectSize + spacing));
		const ctv = mouseY - rectSize - spacing;
		const cv = floor(ctv / (rectSize + spacing)) + 1;
		const c = cv * floor(menuWidth / (rectSize + spacing)) + ch;
		// directives
		const dth = mouseX - gridSize;
		const dh = floor(dth / (rectSize + spacing));
		const dtv = mouseY - rectSize - spacing - directivesY;
		const dv = floor(dtv / (rectSize + spacing)) + 1;
		const d = dv * floor(menuWidth / (rectSize + spacing)) + dh;

		if (ftv % (rectSize + spacing) > spacing && fv < settings.fonctions.length && fh < settings.fonctions[fv] && fh >= 0) {
			if (mouseButton === RIGHT) {
				fonctions[fv] = fonctions[fv] || [];
				fonctions[fv][fh] = [];
			} else {
				selectedFonction = [fv, fh];
			}
		} else if (cth % (rectSize + spacing) > spacing && ctv % (rectSize + spacing) < rectSize && c < settings.colors && c >= 0) {
			fonctions[selectedFonction[0]] = fonctions[selectedFonction[0]] || [];
			fonctions[selectedFonction[0]][selectedFonction[1]] = fonctions[selectedFonction[0]][selectedFonction[1]] || [];
			fonctions[selectedFonction[0]][selectedFonction[1]][1] = c;
		} else if (dth % (rectSize + spacing) > spacing && dtv % (rectSize + spacing) < rectSize && d < 4 && d >= 0) {
			fonctions[selectedFonction[0]] = fonctions[selectedFonction[0]] || [];
			fonctions[selectedFonction[0]][selectedFonction[1]] = fonctions[selectedFonction[0]][selectedFonction[1]] || [];
			fonctions[selectedFonction[0]][selectedFonction[1]][0] = d;
		}
	}
}

function loadGrid(saveData) {
	const field = document.getElementById('saveData');
	const data = JSON.parse(LZString.decompressFromBase64(saveData || field.value));

	for (const setting in data) {
		settings[setting] = data[setting];
	}
}

window.addEventListener('contextmenu', (e) => {
	e.preventDefault();
});

const resize = function() {
	const rows = ceil(sqrt(this.value.length / 6)); // 5:30 -> a:6*a -> size = a*(6*a) = a*6*a = 6*a^2
	this.style.height = 'auto';
	this.style.width = 'auto';
	this.rows = rows;
	this.cols = rows * 6;
};

document.getElementById('saveData').addEventListener('input', resize);
document.getElementById('saveData').addEventListener('change', resize);
document.getElementById('saveData').addEventListener('keydown', resize);