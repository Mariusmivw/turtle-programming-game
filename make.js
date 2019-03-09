const gridSize = 600;
const menuWidth = 250;
const gridSizerSize = 10;
const settings = {
	grid: [],
	colors: 5,
	brushColors: [],
	pos: [0, 0, 0],
	fonctions: [],
	stars: []
};
let selectedGridSizer = [];
let selectedColor = 1;
let colorButtons = [];
let brushes = [];
let gridSizers = [];
let gridCells = [];
let hoverCell = [];
let fonctionInputs = [];
let fonctionAmountInput;
let selectedColorButton;
let colorInput;
let cellSize;
let canvas;

function setup() {
	canvas = createCanvas(
		gridSize + gridSizerSize * 3 + menuWidth + 1,
		gridSize + gridSizerSize * 3 + 1
	).elt;
	document.getElementById('canvasContainer').append(canvas);

	const initialGridSize = 10;
	for (let i = 0; i < initialGridSize; i++) {
		const a = [];
		a.length = initialGridSize;
		settings.grid.push(a.fill(0))
	}

	cellSize = gridSize / settings.grid.length;
	loadGrid(sessionStorage.getItem('saveData') || 'N4Ig5gTglgJiBcBtRAGANOzHtcwXTVR2NxwKNMrMKto3LtoZJd2cZPdda4/xu5MCIAMYB7ADZiIAZwQBWNCAAOYuUjZKAZmIB2IgC5Q96xABY8AXyA==');
	sessionStorage.removeItem('saveData');
}

function draw() {
	if (!document.hidden) {
		background(255);
		push();
		translate(gridSizerSize / 2, gridSizerSize / 2);
		drawGrid();
		drawGridSizers();
		drawMenu();
		pop();
	}
}

function drawGrid() {
	for (const cell of gridCells) {
		if (settings.grid[cell.gridPos[0]][cell.gridPos[1]]) {
			drawGridCell(cell.gridPos[0], cell.gridPos[1], settings.grid[cell.gridPos[0]][cell.gridPos[1]]);
		}
	}
	drawGridCell(hoverCell[0], hoverCell[1], selectedColor);

	push();
	translate(cellSize / 2 + cellSize * settings.pos[0], cellSize / 2 + cellSize * settings.pos[1]);
	rotate(PI / 2 * settings.pos[2]);
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

function drawGridSizers() {
	push();
	rectMode(CENTER);
	for (const s of gridSizers) {
		push();
		if (s == selectedGridSizer[2]) {
			fill(55, 200, 55);
		}
		rect(
			s.x - canvas.offsetLeft,
			s.y - canvas.offsetTop,
			gridSizerSize,
			gridSizerSize
		);
		line(
			s.x - canvas.offsetLeft - gridSizerSize / 2,
			s.y - canvas.offsetTop,
			s.x - canvas.offsetLeft + gridSizerSize / 2,
			s.y - canvas.offsetTop
		);
		if (s.elt.tagName.startsWith(`ADD`)) {
			line(
				s.x - canvas.offsetLeft,
				s.y - canvas.offsetTop - gridSizerSize / 2,
				s.x - canvas.offsetLeft,
				s.y - canvas.offsetTop + gridSizerSize / 2
			);
		}
		pop();
	}
	pop();
}

function drawMenu() {
	push();
	rectMode(CENTER);
	colorMode(HSL);
	for (let i = 0; i < colorButtons.length; i++) {
		const c = colorButtons[i];
		push();
		if (c == selectedColorButton) {
			stroke(255, 255, 255);
			strokeWeight(2);
		}
		fill((360 / settings.colors) * i, 57, 50);
		rect(c.x - canvas.offsetLeft + gridSizerSize / 2, c.y - canvas.offsetTop + gridSizerSize / 2, c.width, c.height);
		pop();
	}
	pop();
}

function createGridCells() {
	for (let i = 0; i < settings.grid.length; i++) {
		for (let u = 0; u < settings.grid.length; u++) {
			const el = createP5Element(
				u * cellSize + canvas.offsetLeft + gridSizerSize / 2,
				i * cellSize + canvas.offsetTop + gridSizerSize / 2,
				cellSize,
				cellSize,
				'cell'
			);
			el.gridPos = [u, i];

			const mousePressed = (start = false) => {
				if (mouseButton == RIGHT) {
					settings.grid[u][i] = 0;
				} else if (mouseButton == CENTER) {
					if (settings.pos[0] == u && settings.pos[1] == i) {
						settings.pos[2] = (settings.pos[2] + 1) % 4;
					} else {
						settings.pos[0] = u;
						settings.pos[1] = i;
					}
				} else {
					if (settings.grid[u][i] == selectedColor) {
						if (start) {
							if (settings.stars.includes(`${u}_${i}`)) {
								if (settings.pos[0] == u && settings.pos[1] == i) {
									settings.pos[2] = (settings.pos[2] + 1) % 4;
								} else {
									settings.pos[0] = u;
									settings.pos[1] = i;
								}
							} else {
								settings.stars.push(`${u}_${i}`);
							}
						}
					} else {
						settings.grid[u][i] = selectedColor;
					}
				}
			}

			el.mouseOver(() => {
				hoverCell = [u, i];
				if (mouseIsPressed) {
					mousePressed();
				}
			});
			el.mousePressed(() => {
				mousePressed(true);
			});
			el.mouseOut(() => {
				hoverCell = [];
			});
			gridCells.push(el);
		}
	}
	createGridSizers();
}

function createGridSizers() {
	for (let i = 0; i < settings.grid.length; i++) {
		const els = [
			createP5Element(
				gridSize + gridSizerSize,
				i * cellSize,
				gridSizerSize,
				gridSizerSize,
				'addrow'
			),
			createP5Element(
				i * cellSize,
				gridSize + gridSizerSize,
				gridSizerSize,
				gridSizerSize,
				'addcol'
			),
			createP5Element(
				gridSize + gridSizerSize,
				cellSize / 2 + i * cellSize,
				gridSizerSize,
				gridSizerSize,
				'remrow'
			),
			createP5Element(
				cellSize / 2 + i * cellSize,
				gridSize + gridSizerSize,
				gridSizerSize,
				gridSizerSize,
				'remcol'
			)
		];
		els.forEach(el => {
			el.position(el.x + canvas.offsetLeft, el.y + canvas.offsetTop);
			el.mouseClicked(() => {
				selectGridSizer(el.elt.tagName, i, el);
			});
		});
		gridSizers = gridSizers.concat(els);
	}
	const i = settings.grid.length;
	const els = [
		createP5Element(
			gridSize + gridSizerSize,
			i * cellSize,
			gridSizerSize,
			gridSizerSize,
			'addrow'
		),
		createP5Element(
			i * cellSize,
			gridSize + gridSizerSize,
			gridSizerSize,
			gridSizerSize,
			'addcol'
		)
	];
	els.forEach(el => {
		el.position(el.x + canvas.offsetLeft, el.y + canvas.offsetTop);
		el.mouseClicked(() => {
			noLoop();
			selectGridSizer(el.elt.tagName, i, el);
			loop();
		});
	});
	gridSizers = gridSizers.concat(els);
}

function selectGridSizer(tag, index, el) {
	if (selectedGridSizer[0] && (selectedGridSizer[0].startsWith('REM') == tag.startsWith('REM') ^ selectedGridSizer[0].endsWith('ROW') == tag.endsWith('ROW'))) {
		if (selectedGridSizer[0].endsWith('ROW') == tag.endsWith('ROW')) {
			// same type, different action
			if (tag.endsWith('ROW')) {
				// type = row
				if (tag.startsWith('REM')) {
					for (const r of settings.grid) {
						r.splice(index, 1);
					}
					for (const r of settings.grid) {
						r.splice(selectedGridSizer[1] - (index < selectedGridSizer[1]), 0, 0);
					}
				} else {
					for (const r of settings.grid) {
						r.splice(selectedGridSizer[1], 1);
					}
					for (const r of settings.grid) {
						r.splice(index - (index > selectedGridSizer[1]), 0, 0);
					}
				}
			} else {
				// type = column
				const r = [];
				r.length = settings.grid.length;
				r.fill(0, 0, r.length);
				if (tag.startsWith('REM')) {
					settings.grid.splice(index, 1);
					settings.grid.splice(selectedGridSizer[1] - (index < selectedGridSizer[1]), 0, r);
				} else {
					settings.grid.splice(selectedGridSizer[1], 1);
					settings.grid.splice(index - (index > selectedGridSizer[1]), 0, r);
				}
			}
		} else {
			// same action, different type
			if (tag.startsWith('REM')) {
				// action = remove
				if (tag.endsWith('ROW')) {
					settings.grid.splice(selectedGridSizer[1], 1);
					for (const r of settings.grid) {
						r.splice(index, 1);
					}
				} else {
					settings.grid.splice(index, 1);
					for (const r of settings.grid) {
						r.splice(selectedGridSizer[1], 1);
					}
				}
			} else {
				// action = add
				const r = [];
				r.length = settings.grid.length;
				r.fill(0, 0, r.length);
				if (tag.endsWith('ROW')) {
					settings.grid.splice(selectedGridSizer[1], 0, r);
					for (const r of settings.grid) {
						r.splice(index, 0, 0);
					}
				} else {
					settings.grid.splice(index, 0, r);
					for (const r of settings.grid) {
						r.splice(selectedGridSizer[1], 0, 0);
					}
				}
			}
		}
		resizeGridCells();
		selectedGridSizer = [];
	} else if (selectedGridSizer[2] == el) {
		selectedGridSizer = [];
	} else {
		selectedGridSizer = [tag, index, el];
	}
}

function resizeGridCells() {
	cellSize = gridSize / settings.grid.length;
	for (const item of gridCells.concat(gridSizers)) {
		item.remove();
	}
	gridCells.length = gridSizers.length = 0;
	createGridCells();
}

function selectColor(c, b) {
	selectedColor = c;
	selectedColorButton = b;
}

function createP5Element(x, y, w, h, t = 'p5Element') {
	const el = createElement(t);
	if (typeof(x) == 'number' && typeof(y) == 'number') {
		el.position(x, y);
	}
	if (typeof(w) == 'number' && typeof(h) == 'number') {
		el.size(w, h);
	}
	el._pInst = p5.instance;
	return el;
}

function createP5Button(x, y, w, h, onclick, t = 'p5Button') {
	const el = createP5Element(x, y, w, h, t);
	el.mouseReleased(onclick);
	return el;
}

function createFilter(color, id) {
	return `<filter id="${id}"><feColorMatrix values="${color[0]/255} 0 0 0 0 ${color[1]/255} 0 0 0 0 ${color[2]/255} 0 0 0 0 0 0 0 1 0"/></filter>`;
}

function keyPressed() {
	selectedColor =
		isNaN(parseInt(key)) ||
		parseInt(key) > settings.colors ||
		parseInt(key) == 0 ?
		selectedColor :
		parseInt(key);
}

function setColorAmount(n) {
	settings.colors = n;
	const rectSize = 20;
	const spacing = 5;

	let y = rectSize / 2 + rectSize + spacing * 2;
	let x = gridSize + gridSizerSize * 2 - spacing;

	for (const b of colorButtons) {
		b.remove();
	}
	colorButtons.length = 0;

	for (let i = 0; i < settings.colors; i++) {
		x += rectSize + spacing;
		if (x > gridSize + menuWidth + gridSizerSize * 3 - rectSize / 2) {
			y += rectSize + spacing;
			x = gridSize + gridSizerSize * 2 + rectSize;
		}
		let elX = x;
		let elY = y;
		const b = createP5Button(x, y, rectSize, rectSize, () => {
			if (mouseButton == RIGHT) {
				if (!settings.brushColors.includes(i)) {
					const b = createP5Element(elX + rectSize / 8, elY + rectSize / 8, rectSize * 3 / 4, rectSize * 3 / 4, 'img');
					b.elt.src = 'paintbrush.svg';
					b.elt.style.filter = 'brightness(0)';
					b.elt.style.pointerEvents = 'none';
					brushes[i] = b;
					settings.brushColors.push(i);
				} else {
					settings.brushColors.splice(settings.brushColors.indexOf(i), 1);
					brushes[i].remove();
					delete brushes[i];
				}
			} else {
				selectColor(i + 1, b);
			}
		}, 'color');
		colorButtons.push(b);
	}
	selectedColorButton = colorButtons[selectedColor - 1] || colorButtons[(selectedColor = colorButtons.length) - 1];
}

function createInputs() {
	createColorInput();
	createFonctionInputs();
}

function createColorInput() {
	colorInput = createP5Element(gridSize + canvas.offsetLeft + gridSizerSize * 3, canvas.offsetTop + gridSizerSize / 2, null, null, 'input');
	colorInput.elt.value = settings.colors.toString();
	colorInput.elt.type = 'number';
	colorInput.elt.min = '1';
	colorInput.elt.max = '32';
	colorInput.elt.id = 'colors';
	colorInput.input(function() {
		setColorAmount(parseInt(this.elt.value));
		let y = canvas.offsetTop + gridSizerSize / 2 + (ceil(settings.colors / floor(menuWidth / 25)) + 2) * 25;
		fonctionAmountInput.position(gridSize + canvas.offsetLeft + gridSizerSize * 3, y);
		for (let i = 0; i < fonctionInputs.length; i++) {
			fonctionInputs[i].position(gridSize + canvas.offsetLeft + gridSizerSize * 3, y + 25 + i * 25);
		}
	});
}

function createFonctionInputs() {
	fonctionAmountInput = createP5Element(gridSize + canvas.offsetLeft + gridSizerSize * 3, canvas.offsetTop + (ceil(settings.colors / floor(menuWidth / settings.colors)) + 2) * 25 + gridSizerSize / 2, null, null, 'input');
	fonctionAmountInput.elt.value = (settings.fonctions.length || 1).toString();
	fonctionAmountInput.elt.type = 'number';
	fonctionAmountInput.elt.min = '1';
	fonctionAmountInput.elt.max = '16';

	function a(amount) {
		const y = canvas.offsetTop + gridSizerSize / 2 + (ceil(settings.colors / floor(menuWidth / 25)) + 3) * 25;
		for (let i = 0; i < amount; i++) {
			if (!fonctionInputs[i]) {
				const input = createP5Element(canvas.offsetLeft + gridSize + gridSizerSize * 3, y + i * 25, null, null, 'input');
				input.elt.value = settings.fonctions[i] || '4';
				input.elt.type = 'number';
				input.elt.min = '2';
				input.elt.max = '8';
				input.input(() => {
					settings.fonctions[i] = parseInt(input.elt.value);
				});
				input._events.input();
				fonctionInputs[i] = input;
			}
		}
	}

	fonctionAmountInput.input(function() {
		const amount = parseInt(this.elt.value);
		settings.fonctions.splice(amount);
		const removedFonctionInputs = fonctionInputs.splice(amount);
		for (const input of removedFonctionInputs) {
			input.remove();
		}
		a(amount);
	});

	const removedFonctionInputs = fonctionInputs.splice(0);
	for (const input of removedFonctionInputs) {
		input.remove();
	}
	a(settings.fonctions.length);


	fonctionAmountInput._events.input();
}

function loadGrid(saveData) {
	const field = document.getElementById('saveData');
	const data = JSON.parse(LZString.decompressFromBase64(field.value = saveData || field.value));

	for (const setting in data) {
		settings[setting] = data[setting];
	}

	if (fonctionAmountInput) {
		fonctionAmountInput.remove();
	}
	for (const i of fonctionInputs) {
		i.remove();
	}
	fonctionInputs.length = 0;
	createInputs();
	setColorAmount(settings.colors);

	for (const cell of gridCells) {
		cell.remove();
	}
	gridCells.length = 0;
	cellSize = gridSize / settings.grid.length;

	createGridCells();
}

function saveGrid() {
	settings.brushColors.sort();
	const saveData = LZString.compressToBase64(JSON.stringify(settings));
	const field = document.getElementById('saveData');
	field.value = saveData;
	resize.apply(field);
}

function playLevel() {
	sessionStorage.setItem('saveData', LZString.compressToBase64(JSON.stringify(settings)));
	gotoPlay();
}

function gotoPlay() {
	location.pathname = location.pathname.replace(/(.*)\/.*?$/, '$1/play.html');
}

['contextmenu', 'dragstart', 'drop', 'selectstart'].forEach(e => {
	window.addEventListener(e, e => {
		e.preventDefault();
	});
});

function resize() {
	const rows = ceil(sqrt(this.value.length / 6)); // 5:30 -> a:6*a -> size = a*(6*a) = a*6*a = 6*a^2
	this.style.height = 'auto';
	this.style.width = 'auto';
	this.rows = rows;
	this.cols = rows * 6;
};

document.getElementById('saveData').addEventListener('input', resize);
document.getElementById('saveData').addEventListener('change', resize);
document.getElementById('saveData').addEventListener('keydown', resize);