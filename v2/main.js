let scene;
let scenes = {};
let p5;

// get scenes
require(['scenes/create/create', 'scenes/play/play'], (...deps) => {
	[scenes['create'], scenes['play']] = deps;

	require(['../lib/p5.min.js', 'data'], (...deps) => {
		const [_p5, data] = deps;

		p5 = new _p5((p5) => {
			// global setup
			p5.setup = function() {
				data.xOffset = data.yOffset = 8;
				p5.createCanvas(window.innerWidth, window.innerHeight);
			}

			p5.draw = function() {
				p5.push();
				// p5.translate(data.xOffset, data.yOffset);
				if (scene) {
					scene.loop();
				}
				p5.pop();
			}
		});
		switchScene(scenes['create']);
	});
});

function switchScene(_scene) {
	scene && scene.term();
	scene = _scene;
	scene.init();
}

window.addEventListener('dragstart', (e) => {
	e.preventDefault();
});