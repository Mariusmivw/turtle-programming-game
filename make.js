const gridSize = 600;
const menuWidth = 250;
const cells = 10;
const cellSize = gridSize / cells;
let selectedColor = 1;
const settings = {
	grid: [],
	colors: 12
};
for (let i = 0; i < cells; i++) {
	settings.grid.push([]);
	for (let u = 0; u < cells; u++) {
		settings.grid[i].push(0);
	}
}
let input;

function setup() {
	const c = createCanvas(gridSize + menuWidth + 1, gridSize + 1).elt;
	document.getElementById('canvasContainer').append(c);
	input = createInput(settings.colors.toString(), 'number');
	input.elt.min = '1';
	input.position(c.offsetLeft + gridSize + 5, c.offsetTop);
	input.input(function () {
		settings.colors = parseInt(this.value());
	})
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
			} else {
				settings.grid[gridPos[0]][gridPos[1]] = selectedColor;
			}
		} else {
			drawGridCell(gridPos[0], gridPos[1], selectedColor);
		}
	}
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
	}
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