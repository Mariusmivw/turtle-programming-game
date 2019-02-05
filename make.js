const gridSize = 600;
const menuWidth = 251;
const cells = 10;
const cellSize = gridSize / cells;
let selectedColor = 1;
let centerClicked = 0;
const settings = {
	grid: [],
	colors: 5,
	pos: [0, 0, 0],
	fonctions: []
};
for (let i = 0; i < cells; i++) {
	settings.grid.push([]);
	for (let u = 0; u < cells; u++) {
		settings.grid[i].push(0);
	}
}
let colorInput;
let fonctionAmountInput;
let fonctionInputs = [];
let canvas;

function setup() {
	canvas = createCanvas(gridSize + menuWidth + 1, gridSize + 1).elt;
	document.getElementById('canvasContainer').append(canvas);
	colorInput = createInput(settings.colors.toString(), 'number');
	colorInput.elt.min = '1';
	colorInput.position(canvas.offsetLeft + gridSize + 5, canvas.offsetTop);
	colorInput.input(function() {
		settings.colors = parseInt(this.value());
		let y = canvas.offsetTop + (ceil(settings.colors / floor(menuWidth / 25)) + 2) * 25;
		fonctionAmountInput.position(canvas.offsetLeft + gridSize + 5, y);
		for (let i = 0; i < fonctionInputs.length; i++) {
			fonctionInputs[i].position(canvas.offsetLeft + gridSize + 5, y + 25 + i * 25);
		}
	});
	loadFonctionInputs();
	fonctionAmountInput._events.input();
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
	const gridPos = getGridMousePos();
	if (
		gridPos[0] < cells &&
		gridPos[1] < cells &&
		gridPos[0] >= 0 &&
		gridPos[1] >= 0
	) {
		if (mouseIsPressed) {
			if (mouseButton === RIGHT) {
				settings.grid[gridPos[0]][gridPos[1]] = 0;
			} else if (mouseButton === CENTER) {
				drawGridCell(gridPos[0], gridPos[1], selectedColor);
				if (++centerClicked != frameCount) {
					centerClicked = frameCount;
					const p = [gridPos[0], gridPos[1], settings.pos[2]];
					if (settings.pos[0] == p[0] && settings.pos[1] == p[1]) {
						settings.pos[2] = (++settings.pos[2]) % 4;
					} else {
						settings.pos = p;
					}
				}
			} else {
				settings.grid[gridPos[0]][gridPos[1]] = selectedColor;
				drawGridCell(gridPos[0], gridPos[1], selectedColor);
			}
		} else {
			drawGridCell(gridPos[0], gridPos[1], selectedColor);
		}
	}

	push();
	translate(30 + 60 * settings.pos[0], 30 + 60 * settings.pos[1]);
	rotate(PI / 2 * settings.pos[2]);
	triangle(0, 0, -20, 20, 20, 20);
	pop();
}

function getGridMousePos() {
	const gridX = floor(mouseX / cellSize);
	const gridY = floor(mouseY / cellSize);
	return [gridX, gridY];
}

function drawGridCell(x, y, c) {
	push();
	colorMode(HSL);
	fill((360 / settings.colors) * (c - 1), 57, 50);
	rect(x * cellSize, y * cellSize, cellSize, cellSize);
	pop();
}

function drawMenu() {
	push();
	rectMode(CENTER);
	colorMode(HSL);
	const buttonSize = 20;
	const spacing = 5;
	let x = gridSize + buttonSize / 2 + spacing;
	let y = buttonSize / 2 + buttonSize + spacing;
	for (let i = 0; i < settings.colors; i++) {
		fill((360 / settings.colors) * i, 57, 50);
		rect(x, y, buttonSize, buttonSize);
		x += buttonSize + spacing;
		if (x > gridSize + menuWidth - buttonSize / 2) {
			y += buttonSize + spacing;
			x = gridSize + buttonSize / 2 + spacing;
		}
	}
	if (mouseIsPressed) {
		const h = floor((mouseX - gridSize) / (buttonSize + spacing)) + 1;
		const v = floor((mouseY - buttonSize - spacing) / (buttonSize + spacing));
		if (
			(mouseX - gridSize) % (buttonSize + spacing) > spacing &&
			mouseY % (buttonSize + spacing) < buttonSize
		) {
			const c = v * floor(menuWidth / (buttonSize + spacing)) + h;
			selectedColor = c > settings.colors || c < 1 ? selectedColor : c;
		}
	}
	noFill();
	stroke(255, 255, 255);
	strokeWeight(2);
	rect(gridSize + buttonSize / 2 + spacing + (buttonSize + spacing) * ((selectedColor - 1) % floor(menuWidth / (buttonSize + spacing))), buttonSize / 2 + (buttonSize + spacing) * ceil(selectedColor / floor(menuWidth / (buttonSize + spacing))), buttonSize, buttonSize);
	pop();
}

function keyPressed() {
	selectedColor =
		isNaN(parseInt(key)) ||
		parseInt(key) > settings.colors ||
		parseInt(key) == 0 ?
		selectedColor :
		parseInt(key);
}

function loadFonctionInputs() {
	if (fonctionAmountInput) {
		fonctionAmountInput.remove();
	}
	fonctionAmountInput = createInput((settings.fonctions.length || 1).toString(), 'number');
	fonctionAmountInput.elt.min = '1';
	fonctionAmountInput.position(canvas.offsetLeft + gridSize + 5, canvas.offsetTop + (ceil(settings.colors / floor(menuWidth / settings.colors)) + 2) * 25);
	fonctionAmountInput.input(function() {
		const amount = parseInt(this.value());
		settings.fonctions.splice(amount);
		for (let i = amount; i < fonctionInputs.length; i++) {
			fonctionInputs[i].remove();
		}
		fonctionInputs.splice(amount);
		const y = canvas.offsetTop + (ceil(settings.colors / floor(menuWidth / 25)) + 3) * 25;
		for (let i = 0; i < amount; i++) {
			if (!fonctionInputs[i]) {
				const input = createInput('4', 'number');
				input.elt.min = '2';
				input.position(canvas.offsetLeft + gridSize + 5, y + i * 25);
				input.input(() => {
					settings.fonctions[i] = parseInt(input.value());
				});
				input._events.input();
				fonctionInputs[i] = input;
			}
		}
	});
	for (const input of fonctionInputs) {
		input.remove();
	}
	const y = canvas.offsetTop + (ceil(settings.colors / floor(menuWidth / 25)) + 3) * 25;
	for (let i = 0; i < settings.fonctions.length; i++) {
		const input = createInput(settings.fonctions[i].toString(), 'number');
		input.elt.min = '2';
		input.position(canvas.offsetLeft + gridSize + 5, y + i * 25);
		input.input(() => {
			settings.fonctions[i] = parseInt(input.value());
		});
		input._events.input();
		fonctionInputs[i] = input;
	}
}

function loadGrid(saveData) {
	const field = document.getElementById('saveData');
	const data = JSON.parse(LZString.decompressFromBase64(saveData || field.value));

	for (const setting in data) {
		settings[setting] = data[setting];
	}
	loadFonctionInputs();
}

function saveGrid() {
	const saveData = LZString.compressToBase64(JSON.stringify(settings));
	const field = document.getElementById('saveData');
	field.value = saveData;
	field.style.display = 'block';
	const rows = ceil(sqrt(saveData.length / 6)); // 5:30 -> a:6*a -> size = a*(6*a) = a*6*a = 6*a^2
	field.style.height = 'auto';
	field.style.width = 'auto';
	field.rows = rows;
	field.cols = rows * 6;
}

window.addEventListener('contextmenu', e => {
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