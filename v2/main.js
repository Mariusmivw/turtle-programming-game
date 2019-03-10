let scene;
let scenes = {};
let p5;

// get scenes
require(['scenes/create/create', 'scenes/play/play'], (...deps) => {
	[scenes['create'], scenes['play']] = deps;

	require(['../lib/p5.min.js'], (...deps) => {
		const [_p5] = deps;

		p5 = new _p5((p5) => {
			// global setup
			p5.setup = function() {}

			p5.draw = function() {
				if (scene) {
					scene.loop();
				}
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