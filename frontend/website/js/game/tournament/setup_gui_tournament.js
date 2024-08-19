import { redraw } from "../game_utils.js";
import { sphereData } from "../game_config.js";
import dat from "../dat.gui.js";
import { animate_tournament } from './animate_tournament.js';

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
export function setupGUI(gameData, TournamentData) {
	// Create GUI Panel


	const gui = new dat.GUI({ autoPlace: false });
	const controls = {
		Start: function () {
			if (!gameData.isAnimating) {
				// Calculate how much time has passed since the animation was paused
				gameData.clock.start();
				gameData.clock.elapsedTime = gameData.pausedTime;
				gameData.isAnimating = true;
				console.log('Animation started or resumed');
				animate_tournament(gameData, TournamentData);  // Start the animation loop
			}
		},
		Pause: function () {
			if (gameData.isAnimating) {
				gameData.isAnimating = false;  // This pauses the animation loop
				gameData.pausedTime = gameData.clock.getElapsedTime(); // Store the elapsed time
				gameData.clock.stop();
				console.log('Animation paused');
			}
		}
	};
	gui.domElement.id = 'gui';
	document.getElementById('gui_container').appendChild(gui.domElement);

	// adds the previously create start/pause buttons
    gui.add(controls, 'Start');
    gui.add(controls, 'Pause');

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