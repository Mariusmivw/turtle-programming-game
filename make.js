const gridSize = 600;
const menuWidth = 250;
const cells = 10;
const cellSize = gridSize / cells;
let colors;
let selectedColor;
const settings = {
	grid: []
}
for (let i = 0; i < cells; i++) {
	settings.grid.push([]);
	for (let u = 0; u < cells; u++) {
		settings.grid[i].push(0);
	}
}

function setup() {
	colors = {
		RED: color(200, 55, 55),
		GREEN: color(55, 200, 55),
		BLUE: color(55, 55, 200)
	}
	selectedColor = colors.RED;
	const c = createCanvas(gridSize + menuWidth, gridSize + 1).elt;
	document.getElementById('canvasContainer').append(c);
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
	const gridPos = getGridMousePos();
	if (gridPos[0] < cells && gridPos[1] < cells && gridPos[0] >= 0 && gridPos[1] >= 0) {
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
	for (let i = 0; i < settings.grid.length; i++) {
		for (let u = 0; u < settings.grid[i].length; u++) {
			if (settings.grid[i][u]) {
				drawGridCell(i, u, settings.grid[i][u]);
			}
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
	fill(c);
	rect(x * cellSize, y * cellSize, cellSize, cellSize);
	pop();
}

function drawMenu() {
	push();
	const menuX = menuWidth / 2 + gridSize;
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
	let y = menuY;
	switch (selectedColor) {
		case colors.RED:
			y -= 25;
			break;
		case colors.BLUE:
			y += 25;
			break;
	}
	fill(0, 0);
	stroke(255, 255, 255);
	strokeWeight(2);
	rect(menuX, y, buttonSize, buttonSize);
	pop();
}

function keyPressed() {
	switch (key) {
		case '1':
			selectedColor = colors.RED;
			break;
		case '2':
			selectedColor = colors.GREEN;
			break;
		case '3':
			selectedColor = colors.BLUE;
			break;
	}
}

function saveGrid() {
	const t = {};
	for (const prop in settings) {
		t[prop] = settings[prop];
	}
	t.grid = [];
	for (let i = 0; i < settings.grid.length; i++) {
		t.grid.push([])
		for (let u = 0; u < settings.grid[i].length; u++) {
			switch (settings.grid[i][u]) {
				case colors.RED:
					t.grid[i].push(1);
					break;
				case colors.GREEN:
					t.grid[i].push(2);
					break;
				case colors.BLUE:
					t.grid[i].push(3);
					break;
				default:
					t.grid[i].push(0);
					break;
			}
		}
	}
	const saveData = LZString.compressToBase64(LZString.compress(JSON.stringify(t)));
	const field = document.getElementById('saveData');
	field.value = saveData;
	field.style.display = 'block';
	const rows = ceil(sqrt(saveData.length / 6)); // 5:30 -> a:6*a -> size = a*(6*a) = a*6*a = 6*a^2
	field.style.height = 'auto';
	field.style.width = 'auto';
	field.rows = rows;
	field.cols = rows * 6;
}

window.addEventListener('contextmenu', (e) => {
	e.preventDefault();
});