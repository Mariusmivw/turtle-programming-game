const gridSize = 600;
const menuWidth = 250;
const cells = 10;
const cellSize = gridSize / cells;
let colors;
let selectedColor;
const settings = {
	grid: [],
	fonctions: [4, 3, 6]
};

function setup() {
	colors = {
		RED: color(200, 55, 55),
		GREEN: color(55, 200, 55),
		BLUE: color(55, 55, 200)
	}
	selectedColor = colors.RED;
	const c = createCanvas(gridSize + menuWidth, gridSize + 1).elt;
	document.getElementById('canvasContainer').append(c);
	loadGrid('kHsjOCQHIIQGmKBGi2A4gCKBYAw4zeBnWwsuiDcVQYgOAdjQOxSBcy4NC/gT2WCNLoJnbg56qDV24P5XgG+SBRAYB2wgIw6D1jIIA8gAT5A=')
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
	fill(c);
	rect(x * cellSize, y * cellSize, cellSize, cellSize);
	pop();
}

function drawMenu() {
	drawFonctions();
	drawSelection();
}

function drawFonctions() {
	push();
	rectMode(CENTER);
	let y = gridSize / 2;
	text('Fonctions:', menuWidth / 4 + gridSize, gridSize / 2);
	for (let i = 0; i < settings.fonctions.length; i++) {
		let x = gridSize + menuWidth / 8;
		y += 16;
		text('F' + (i + 1).toString(), x - menuWidth / 32 * 1.5, y + 4)
		for (let u = 0; u < settings.fonctions[i]; u++) {
			x += menuWidth / 16;
			rect(x, y, 16, 16);
		}
	}
	pop();
}

function drawSelection() {
	push();
	const menuX = menuWidth / 4 * 3 + gridSize;
	const menuY = gridSize / 2;
	const buttonSize = 20;

	rectMode(CENTER);
	fill(colors.RED);
	rect(menuX, menuY - 25, buttonSize, buttonSize);
	fill(colors.GREEN);
	rect(menuX, menuY, buttonSize, buttonSize);
	fill(colors.BLUE);
	rect(menuX, menuY + 25, buttonSize, buttonSize);

	if (mouseIsPressed) {
		if (mouseX > menuX - buttonSize / 2 && mouseX < menuX + buttonSize / 2) {
			if (mouseY > menuY - 25 - buttonSize / 2 && mouseY < menuY - 25 + buttonSize / 2) {
				selectedColor = colors.RED;
			} else if (mouseY > menuY - buttonSize / 2 && mouseY < menuY + buttonSize / 2) {
				selectedColor = colors.GREEN;
			} else if (mouseY > menuY + 25 - buttonSize / 2 && mouseY < menuY + 25 + buttonSize / 2) {
				selectedColor = colors.BLUE;
			}
		}
	}
	pop();
}

function loadGrid(saveData) {
	const field = document.getElementById('saveData');
	const data = JSON.parse(LZString.decompress(LZString.decompressFromBase64(saveData || field.value)));

	for (const setting in data) {
		settings[setting] = data[setting];
	}

	// fix grid ([1, 3, 1, 2] => [colors.RED, colors.BLUE, colors.RED, colors.GREEN])

	settings.grid = [];

	for (let i = 0; i < data.grid.length; i++) {
		settings.grid.push([]);
		for (let u = 0; u < data.grid[i].length; u++) {
			switch (data.grid[i][u]) {
				case 1:
					settings.grid[i].push(colors.RED);
					break;
				case 2:
					settings.grid[i].push(colors.GREEN);
					break;
				case 3:
					settings.grid[i].push(colors.BLUE);
					break;
				default:
					settings.grid[i].push(0);
					break;
			}
		}
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