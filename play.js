const gridSize = 600;
const menuWidth = 251;
let cellSize;
let colors;
let saveData;
const settings = {
	grid: [],
	fonctions: [],
	brushColors: [],
	colors: 3,
	pos: [0, 0, 0],
	stars: []
};
let fonctions = [];
let selectedFonction = [0, 0];
let colorButtons = [];
let directiveButtons = [];
let fonctionButtons = [];
let brushElements = [];

let stepList = [
	[3] // F1
];
let pos = settings.pos.slice();
let stepInterval;

function setup() {
	const c = createCanvas(gridSize + menuWidth, gridSize + 1).elt;
	document.getElementById('canvasContainer').append(c);
	loadGrid(
		sessionStorage.getItem('saveData') ||
		'N4Ig5gTglgJiBcBtRAGANOzHtcwXTVTQEY0AWcyi6ylAo03HbAZg3vUeabbsM+6DeHEoJ7t+opuL4MxzYZIBMaFWtUaViotPl0CIAMYB7ADbGIAZwQUQAB2PWkpFwYBmxgHaGALlC9OiDTUeAC+QA==='
	);
	sessionStorage.removeItem('saveData');
	textAlign(LEFT, CENTER);
}

function draw() {
	if (!document.hidden) {
		background(255);
		drawGrid();
		drawMenu();
	}
}

function drawGrid() {
	for (let i = 0; i < settings.grid.length; i++) {
		for (let u = 0; u < settings.grid[i].length; u++) {
			if (settings.grid[i][u]) {
				drawGridCell(i, u, settings.grid[i][u]);
			}
		}
	}

	push();
	translate(cellSize / 2 + cellSize * pos[0], cellSize / 2 + cellSize * pos[1]);
	rotate((PI / 2) * pos[2]);
	triangle(0, 0, -cellSize / 3, cellSize / 3, cellSize / 3, cellSize / 3);
	pop();

	for (let i = 0; i <= settings.grid.length; i++) {
		line(i * cellSize, 0, i * cellSize, gridSize);
		line(0, i * cellSize, gridSize, i * cellSize);
	}
}

function drawGridCell(x, y, c) {
	push();
	noStroke();
	colorMode(HSL);
	fill((360 / settings.colors) * (c - 1), 57, 50);
	rect(x * cellSize, y * cellSize, cellSize, cellSize);
	pop();
}

function drawMenu() {
	const rectSize = 20;
	const spacing = 5;

	// draw colors
	push();
	rectMode(CENTER);
	colorMode(HSL);
	for (let i = 0; i < colorButtons.length; i++) {
		const b = colorButtons[i];
		fill((360 / settings.colors) * i, 57, 50);
		rect(b.x, b.y, b.width, b.height);
	}
	pop();

	// draw directives
	push();
	rectMode(CENTER);
	for (let i = 0; i < directiveButtons.length; i++) {
		const b = directiveButtons[i];
		rect(b.x, b.y, b.width, b.height);
		drawDirective(i, b.x, b.y, b.height);
	}
	pop();

	// draw Fonctions
	push();
	rectMode(CENTER);
	textSize(16);
	text(
		'Fonctions:',
		gridSize + 3,
		directiveButtons[directiveButtons.length - 1].y + (rectSize + spacing) * 2
	);
	textAlign(CENTER, CENTER);
	let counter = 0;
	for (let i = 0; i < settings.fonctions.length; i++) {
		const b = fonctionButtons[counter];
		text('F' + (i + 1).toString(), b.x - b.width - 2, b.y);
		for (let u = 0; u < settings.fonctions[i]; u++) {
			const b = fonctionButtons[counter++];

			let c = false;
			try {
				if (typeof fonctions[i][u][1] == 'number') {
					const h = (fonctions[i][u][1] * 360) / settings.colors;
					push();
					colorMode(HSL);
					fill(h, 57, 50);
					c = true;
				}
			} catch {}

			rect(b.x, b.y, b.width, b.height);

			if (c) pop();

			if (
				fonctions[i] &&
				fonctions[i][u] &&
				typeof fonctions[i][u][0] == 'number'
			) {
				drawDirective(fonctions[i][u][0], b.x, b.y, b.width);
			}
		}
	}
	push();
	noFill();
	stroke(255, 0, 0);
	strokeWeight(2);
	rect(
		gridSize + rectSize / 2 + spacing + rectSize * (selectedFonction[1] + 1),
		directiveButtons[directiveButtons.length - 1].y +
		(rectSize + spacing) * 2 +
		(rectSize + spacing) * (selectedFonction[0] + 1),
		rectSize,
		rectSize
	);
	pop();
	pop();
}

function getFonctionButton(f, i) {
	if (i >= settings.fonctions[f]) {
		return false;
	}
	for (let u = 0; u < f; u++) {
		i += settings.fonctions[u];
	}
	return fonctionButtons[i];
}

function drawDirective(n, x, y, s) {
	push();
	if (n < 3) {
		translate(x, y);
		push();
		strokeWeight(1.3);
		line(0, 0, 0, s / 3);
		pop();
		rotate((PI / 2) * (n - 1));
		triangle(0, -s / 3, -s / 4, -s / 6, s / 4, -s / 6);
		push();
		strokeWeight(1.3);
		line(0, 0, 0, -s / 6);
		pop();
	} else if (n - 3 < settings.fonctions.length) {
		textSize((s / 5) * 3);
		textAlign(CENTER, CENTER);
		text('F' + (n - 2).toString(), x, y);
	} else if (n - 3 - settings.fonctions.length < settings.brushColors.length) {
		// html so not here
	}
	pop();
}

function createP5Element(x, y, w, h, t = 'p5Element') {
	const el = createElement(t);
	el.position(x, y);
	el.size(w, h);
	return el;
}

function createP5Button(x, y, w, h, onclick, t = 'p5Button') {
	const el = createP5Element(x, y, w, h, t);
	el.mouseReleased(onclick);
	return el;
}

function selectColor(c) {
	fonctions[selectedFonction[0]] = fonctions[selectedFonction[0]] || [];
	fonctions[selectedFonction[0]][selectedFonction[1]] =
		fonctions[selectedFonction[0]][selectedFonction[1]] || [];
	fonctions[selectedFonction[0]][selectedFonction[1]][1] =
		c == fonctions[selectedFonction[0]][selectedFonction[1]][1] ? undefined : c;
}

function selectDirective(d) {
	fonctions[selectedFonction[0]] = fonctions[selectedFonction[0]] || [];
	fonctions[selectedFonction[0]][selectedFonction[1]] =
		fonctions[selectedFonction[0]][selectedFonction[1]] || [];
	if (
		fonctions[selectedFonction[0]][selectedFonction[1]][0] >
		2 + settings.fonctions.length
	) {
		document.getElementById(
			`${selectedFonction[0]}_${selectedFonction[1]}`
		).outerHTML = '';
	}
	fonctions[selectedFonction[0]][selectedFonction[1]][0] =
		d == fonctions[selectedFonction[0]][selectedFonction[1]][0] ? undefined : d;
	if (
		fonctions[selectedFonction[0]][selectedFonction[1]][0] >
		2 + settings.fonctions.length
	) {
		const b = getFonctionButton(selectedFonction[0], selectedFonction[1]);
		createBrush(
			settings.brushColors[d - 3 - settings.fonctions.length] + 1,
			b.x + b.width / 16,
			b.y + b.height / 16,
			(b.width * 3) / 4,
			(b.height * 3) / 4,
			`${selectedFonction[0]}_${selectedFonction[1]}`
		);
	}
}

function createBrush(c, x, y, w, h, id) {
	const brush = createP5Element(x, y, w, h, 'img');
	brush.elt.src = 'paintbrush.svg';
	brush.elt.style.filter = `url(#${getBrushFilterId(c)})`;
	brush.elt.style.pointerEvents = 'none';
	id && (brush.elt.id = id);
	brushElements.push(brush);
	return brush;
}

function getBrushFilterId(c) {
	const rgb = HSL2RGB(
		((360 / settings.colors) * (c - 1)) / 360,
		57 / 100,
		50 / 100
	);
	if (!document.querySelector(`filter#c${rgb[0]}_${rgb[1]}_${rgb[2]}`)) {
		createFilter(rgb[0], rgb[1], rgb[2], `c${rgb[0]}_${rgb[1]}_${rgb[2]}`);
	}
	return `c${rgb[0]}_${rgb[1]}_${rgb[2]}`;
}

function HSL2RGB(h, s, l) {
	if (s == 0) {
		return [Math.round(l * 255), Math.round(l * 255), Math.round(l * 255)]; // achromatic
	} else {
		const hue2rgb = function hue2rgb(p, q, t) {
			if (t < 0) {
				t++;
			}
			if (t > 1) {
				t--;
			}
			if (t < 1 / 6) {
				return p + (q - p) * 6 * t;
			}
			if (t < 1 / 2) {
				return q;
			}
			if (t < 2 / 3) {
				return p + (q - p) * (2 / 3 - t) * 6;
			}
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		return [
			Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
			Math.round(hue2rgb(p, q, h) * 255),
			Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
		];
	}
}

function selectFonction(i, u) {
	if (mouseButton === RIGHT) {
		fonctions[i] = fonctions[i] || [];
		fonctions[i][u] = [];
	} else {
		selectedFonction = [i, u];
	}
}

function createMenuButtons() {
	const rectSize = 20;
	const spacing = 5;
	let x;
	let y;

	x = gridSize - rectSize / 2;
	y = rectSize / 2;
	for (let i = 0; i < settings.colors; i++) {
		x += rectSize + spacing;
		if (x > gridSize + menuWidth - rectSize / 2) {
			y += rectSize + spacing;
			x = gridSize + rectSize / 2 + spacing;
		}
		colorButtons.push(
			createP5Button(x, y, rectSize, rectSize, () => {
				selectColor(i);
			})
		);
	}

	x = gridSize - rectSize / 2;
	y += (rectSize + spacing) * 2;
	for (
		let i = 0; i < 3 + settings.fonctions.length + settings.brushColors.length; i++
	) {
		x += rectSize + spacing;
		if (x > gridSize + menuWidth - rectSize / 2) {
			y += rectSize + spacing;
			x = gridSize + rectSize / 2 + spacing;
		}
		directiveButtons.push(
			createP5Button(x, y, rectSize, rectSize, () => {
				selectDirective(i);
			})
		);
		if (i >= 3 + settings.fonctions.length) {
			createBrush(
				settings.brushColors[i - 3 - settings.fonctions.length] + 1,
				x + rectSize / 16,
				y + rectSize / 16,
				(rectSize * 3) / 4,
				(rectSize * 3) / 4
			);
		}
	}

	y += (rectSize + spacing) * 2;
	for (let i = 0; i < settings.fonctions.length; i++) {
		x = gridSize + rectSize / 2 + spacing;
		y += rectSize + spacing;
		for (let u = 0; u < settings.fonctions[i]; u++) {
			x += rectSize;
			fonctionButtons.push(
				createP5Button(x, y, rectSize, rectSize, () => {
					selectFonction(i, u);
				})
			);
		}
	}
}

function createFilter(r, g, b, name) {
	const f = `<filter id="${name}"><feColorMatrix values="${r /
		255} 0 0 0 0 ${g / 255} 0 0 0 0 ${b / 255} 0 0 0 0 0 0 0 1 0"/><filter>`;
	document.querySelector('#filters').innerHTML += f;
}

function loadGrid(_saveData) {
	const field = document.getElementById('saveData');
	const data = JSON.parse(
		LZString.decompressFromBase64((field.value = _saveData || field.value))
	);
	saveData = field.value;

	for (const setting in data) {
		settings[setting] = data[setting];
	}
	settings.brushColors.sort();

	cellSize = gridSize / settings.grid.length;
	pos = settings.pos.slice();
	fonctions = [];


	for (const b of colorButtons.concat(directiveButtons, fonctionButtons, brushElements)) {
		b.remove();
	}
	colorButtons.length = directiveButtons.length = fonctionButtons.length = brushElements.length = 0;
	document.querySelector('#filters').innerHTML = '';

	createMenuButtons();
}

function edit() {
	sessionStorage.setItem('saveData', saveData);
	gotoCreation();
}

function gotoCreation() {
	location.pathname = location.pathname.replace(/(.*)\/.*?$/, '$1/make.html');
}

function play() {
	stop();
	stepInterval = setInterval(() => {
		if (stepList.length > 0) {
			step();
		} else {
			stop(false);
		}
	}, 1000 / parseInt(document.getElementById('speed').value));
}

function stop(resetPos = true, resetGrid = true) {
	clearInterval(stepInterval);
	stepList = [
		[3] // F1
	];
	resetGrid && (settings.grid = JSON.parse(LZString.decompressFromBase64(saveData)).grid);
	resetPos && (pos = settings.pos.slice());
}

function step() {
	if (stepList.length > 0 && settings.grid[pos[0]][pos[1]] != 0) {
		const s = stepList.shift(); // current step
		const d = s[0]; // directive
		const c = s[1]; // color
		if (s.length > 0 && (c == undefined || settings.grid[pos[0]][pos[1]] == c + 1)) {
			// color on tile or no required color
			if (d > 2 + settings.fonctions.length) {
				// d is for brush
				if (d - 3 - settings.fonctions.length < settings.brushColors.length) {
					settings.grid[pos[0]][pos[1]] =
						settings.brushColors[d - 3 - settings.fonctions.length] + 1;
				} else {
					step();
				}
			} else if (d > 2) {
				// d is for function
				if (fonctions[d - 3]) {
					for (let i = fonctions[d - 3].length - 1; i >= 0; i--) {
						// add steps
						stepList.unshift(fonctions[d - 3][i]);
					}
					step(); // do step for visuals
				} else {
					stop(false, false);
				}
			} else if (d == 1) {
				// forward
				pos[0] -= (pos[2] - 2) % 2;
				pos[1] += (pos[2] - 1) % 2;
			} else {
				// rotate (0 == left && 2 == right)
				pos[2] = (4 + pos[2] + d - 1) % 4;
			}
		} else {
			// dont do anything just go to next step
			step();
		}
	} else {
		stop(false, false);
	}
}

['contextmenu', 'dragstart', 'drop', 'selectstart'].forEach(e => {
	window.addEventListener(e, e => {
		e.preventDefault();
	});
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