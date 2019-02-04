const gridSize = 600;
const menuWidth = 250;
const cells = 10;
const cellSize = gridSize / cells;
let colors;
let selectedColor;
const settings = {
	grid: [],
	fonctions: [4, 3, 6],
	colors: 3
};

function setup() {
	const c = createCanvas(gridSize + menuWidth, gridSize + 1).elt;
	document.getElementById('canvasContainer').append(c);
	loadGrid('N4Ig5gTglgJiBcBtRAGANOzHtcwXTVTQEY0AWcyi6ylAo03HbAZg3vUeabbsM+6DeHEoJ7t+opuL4MxzYZIBMaFWtUaViotPl0CIAMYB7ADbGIAZwRkAvkA=')
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
}

function drawGridCell(x, y, c) {
	push();
	colorMode(HSL);
	fill((360 / settings.colors) * (c - 1), 57, 50);
	rect(x * cellSize, y * cellSize, cellSize, cellSize);
	pop();
}

function drawMenu() {
	drawFonctions();
	drawSelection();
}

function drawFonctions() {
	push();
	const size = 24;
	const boxSize = size * 1.25;
	const xStart = gridSize + menuWidth / 8;
	let y = gridSize / 2;
	textSize(size);
	rectMode(CENTER);
	text('Fonctions:', menuWidth / 4 + gridSize, y + size / 3);
	for (let i = 0; i < settings.fonctions.length; i++) {
		let x = xStart;
		y += boxSize;
		text('F' + (i + 1).toString(), x - menuWidth / 32 * size / 8, y + size / 3)
		for (let u = 0; u < settings.fonctions[i]; u++) {
			x += boxSize;
			rect(x, y, boxSize, boxSize);
		}
	}
	pop();
}

function drawSelection() {
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
	// noFill();
	// stroke(255, 255, 255);
	// strokeWeight(2);
	// rect(gridSize + buttonSize / 2 + spacing + (buttonSize + spacing) * ((selectedColor - 1) % floor(menuWidth / (buttonSize + spacing))), buttonSize / 2 + (buttonSize + spacing) * ceil(selectedColor / floor(menuWidth / (buttonSize + spacing))), buttonSize, buttonSize);
	pop();
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

const resize = function () {
	const rows = ceil(sqrt(this.value.length / 6)); // 5:30 -> a:6*a -> size = a*(6*a) = a*6*a = 6*a^2
	this.style.height = 'auto';
	this.style.width = 'auto';
	this.rows = rows;
	this.cols = rows * 6;
};

document.getElementById('saveData').addEventListener('input', resize);
document.getElementById('saveData').addEventListener('change', resize);
document.getElementById('saveData').addEventListener('keydown', resize);