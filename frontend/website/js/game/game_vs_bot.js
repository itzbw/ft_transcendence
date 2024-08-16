import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { loadContent } from '../tools/tools.js';
import {
	getPlayerName,
	handleEndGame,
	createCamera,
	createBoard,
	cleanHTMLElements, showHTMLElements,
	createPaddle, groupPaddles,
	createBall,
	destroy,
	redraw,
	setupGUI,
	setupMouseListeners
} from './game_utils.js';
import {
	scoreLimit,
	paddleWidth, paddleHeight, paddleDepth,
	paddleSpeed,
	sphereData,
	boardWidth, boardLength,
	leftScoreElement, rightScoreElement
} from './game_config.js';
import { animate } from './animate.js';


// will create needed variables, store them and return an object
async function initGameData() {

	// get player name
	const player = await getPlayerName();

	// Score
	let leftScore = 0
	let rightScore = 0;

	// Create the scene
	const scene = new THREE.Scene();

	// Create a camera
	const camera = createCamera();

	// Create a renderer
	const renderer = new THREE.WebGLRenderer({ alpha: true });

	// Create a point light (no need to share)
	const light = new THREE.AmbientLight(0xffffff, 3);
	light.position.set(10, 10, 10);
	scene.add(light);

	// Main board
	const board = createBoard();
	scene.add(board);

	// #region Paddles
	// paddles
	const leftPaddle = createPaddle(0x0000ff);
	leftPaddle.position.set(-5, 0.15, 0); // Position it on the left edge of the board
	const rightPaddle = createPaddle(0x00ffff);
	rightPaddle.position.set(5, 0.15, 0); // Position it on the right edge of the board

	// Group paddles //
	const groupPaddle = groupPaddles(leftPaddle, rightPaddle);
	scene.add(groupPaddle);
	// #endregion


	// #region Ball	
	// Create the ball
	const ball = createBall();

	// Add the sphere to the scene
	ball.position.set(0, 0.1, 0); // Position it at the center of the board
	scene.add(ball);

	// variable for ball movement speed
	let ballDirX = 0.1;
	let ballDirZ = 0.1;
	var ballRotationSpd = { x: 0.2, y: 0, z: 0 }
	// #endregion


	// #region Keys
	// Key states for paddle movement
	const keys = {
		ArrowUp: false,
		ArrowDown: false,
		KeyW: false,
		KeyS: false
	};
	// #endregion

	// controls
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.update();

	// full structure
	const gameData = {
		player: player,
		leftScore: leftScore,
		rightScore: rightScore,
		scene: scene,
		camera: camera,
		renderer: renderer,
		board: board,
		leftPaddle: leftPaddle,
		rightPaddle: rightPaddle,
		groupPaddle: groupPaddle,
		ball: ball,
		ballDirX: ballDirX,
		ballDirZ: ballDirZ,
		ballRotationSpd: ballRotationSpd,
		keys: keys,
		controls: controls
	}

	return (gameData);
}

// set events on keyboard (VS BOT)
function setupKeyboardListeners(gameData) {
	document.addEventListener('keydown', (event) => {
		if (event.code === 'ArrowUp') {
			gameData.keys.ArrowUp = true;
		} else if (event.code === 'ArrowDown') {
			gameData.keys.ArrowDown = true;
		} else if (event.code === 'KeyW') {
			gameData.keys.KeyW = true;
		} else if (event.code === 'KeyS') {
			gameData.keys.KeyS = true;
		}
	});

	document.addEventListener('keyup', (event) => {
		if (event.code === 'ArrowUp') {
			gameData.keys.ArrowUp = false;
		} else if (event.code === 'ArrowDown') {
			gameData.keys.ArrowDown = false;
		} else if (event.code === 'KeyW') {
			gameData.keys.KeyW = false;
		} else if (event.code === 'KeyS') {
			gameData.keys.KeyS = false;
		}
	});
}


export async function loadVsBotGame() {

	// load template
	await loadContent('static/game/game.html', 'main-box');

	// clean score and instructions in HTML elements
	cleanHTMLElements();

	// initialize game data
	const gameData = await initGameData();

	// insert it in the gameContainer
	const gameContainer = document.getElementById('gameContainer');
	if (gameContainer) {
		gameContainer.innerHTML = ''; // Clear any existing content
		gameContainer.appendChild(gameData.renderer.domElement);
	}
	
	// display the name/score and the control info panel
	showHTMLElements(gameContainer, gameData.player, 'Marvin');

	// setup GUI control panel
	setupGUI(gameData);

	const resizeRenderer = () => {
		gameData.camera.aspect = window.innerWidth / window.innerHeight;
		gameData.camera.updateProjectionMatrix();
		gameData.renderer.setSize(window.innerWidth, window.innerHeight);
	};
	resizeRenderer();

	window.addEventListener('resize', resizeRenderer);

	// Add mouse and keyboard interactions
	setupMouseListeners(gameData);
	setupKeyboardListeners(gameData);

	animate(gameData);
}
