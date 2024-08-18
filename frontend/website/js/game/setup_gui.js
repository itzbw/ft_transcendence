import { redraw } from "./game_utils.js";
import { sphereData } from "./game_config.js";
import dat from "./dat.gui.js";

// Helper function to add color controllers
function addColorController(gui, obj, colorProp, onChangeCallback) {
	const colorData = { [colorProp]: obj.material.color.getHex() };
	gui.addColor(colorData, colorProp)
		.onChange((value) => {
			obj.material.color.set(value);
			if (onChangeCallback) onChangeCallback();
		});
}

// GUI Setup
export function setupGUI(gameData) {
	// Create GUI Panel
	const gui = new dat.GUI({ autoPlace: false });
	gui.close();
	gui.domElement.id = 'gui';
	document.getElementById('gui_container').appendChild(gui.domElement);

	// Paddle Size Change
	gui.add(gameData.groupPaddle.scale, 'z', 0.5, 1).name('Paddle Size');
	
	// Ball Size Change
	gui
		.add(sphereData, 'radius', 0.3, 1)
		.name('Ball Size')
		.onChange(() => redraw(gameData.ball));
	
	// Board Wireframe Toggle
	gui.add(gameData.board.material, 'wireframe').name('Board Wireframe');
	
	// Paddle Color Changes
	addColorController(gui, gameData.leftPaddle, 'leftPaddleColor');
	addColorController(gui, gameData.rightPaddle, 'rightPaddleColor');
	
	// Ball Color Change
	addColorController(gui, gameData.ball, 'ballColor');
	
	// Board Color Change
	addColorController(gui, gameData.board, 'boardColor');

	// Store GUI instance
	gameData.gui = gui;
}