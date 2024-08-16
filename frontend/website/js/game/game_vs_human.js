import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { loadContent } from '../tools/tools.js';
import {
	getPlayerName,
	createCamera,
	createBoard,
	cleanHTMLElements, showHTMLElements,
	createPaddle, groupPaddles,
	createBall,
	setupGUI,
	setupMouseListeners,
	setupKeyboardListeners,
} from './game_utils.js';
import { animate } from './animate.js';
import { getChallenger } from './game_challengers.js'

// will create needed variables, store them and return an object
async function initGameData(challengerName) {

	// get player name
	const player = await getPlayerName();
	const challenger = challengerName;

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
		challenger: challenger,
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


export async function vsHumanGame(challengerName) {

		// load template
		await loadContent('static/game/game.html', 'main-box');

		// clean score and instructions in HTML elements
		cleanHTMLElements();
	
		// initialize game data
		const gameData = await initGameData(challengerName);

		// insert renderer in the gameContainer
		const gameContainer = document.getElementById('gameContainer');
		if (gameContainer) {
			gameContainer.innerHTML = ''; // Clear any existing content
			gameContainer.appendChild(gameData.renderer.domElement);
		}

// HERE
		// display the name/score and the control info panel
		showHTMLElements(gameContainer, gameData.player, gameData.challenger);
	
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

		// Render the scene from the perspective of the camera
		function animate() {
		  requestAnimationFrame(animate);

		  // check winner
		  if (leftScore >= scoreLimit) {
			winnerElement.innerHTML = 'Left Player Wins!';
			winnerElement.style.display = 'block';
			//setTimeout(resetGame, 3000);
			return;
		  } else if (rightScore >= scoreLimit) {
			winnerElement.innerHTML = 'Right Player Wins!';
			winnerElement.style.display = 'block';
			//setTimeout(resetGame, 3000);
			return;
		  }
	  
	  
		  // Paddle movement based on key states
		  const paddleSpeed = 0.2;
		  if (keys.ArrowUp) {
			rightPaddle.position.z -= paddleSpeed;
		  }
		  if (keys.ArrowDown) {
			rightPaddle.position.z += paddleSpeed;
		  }
		  if (keys.KeyW) {
			leftPaddle.position.z -= paddleSpeed;
		  }
		  if (keys.KeyS) {
			leftPaddle.position.z += paddleSpeed;
		  }
	  
		  // Clamp paddle position within board boundaries
		  const boardHeight = 5;
		  const paddleLength = 1; // Half of the paddle's height for boundary calculation
		  const paddleHalfDepth = paddleDepth / 2;
		  rightPaddle.position.z = THREE.MathUtils.clamp(rightPaddle.position.z, -boardHeight + (boardHeight / 2 + paddleLength / 2), boardHeight - (boardHeight / 2 + paddleLength / 2));
		  leftPaddle.position.z = THREE.MathUtils.clamp(leftPaddle.position.z, -boardHeight + (boardHeight / 2 + paddleLength / 2), boardHeight - (boardHeight / 2 + paddleLength / 2));
	  
		  // ball movement
		  ball.position.x += ballDirX * 0.5;
		  ball.position.z += ballDirZ * 0.5;
	  
		  // ball collision with top and bottom all
		  if (ball.position.z > boardLength / 2 || ball.position.z < -boardLength / 2)
			ballDirZ = -ballDirZ;
	  
		  // ball collision with the paddle
		  const onCollide = () => {
			if (ballRotationSpd.x) {
			  ballRotationSpd.y = ballRotationSpd.x;
			  ballRotationSpd.x = 0;
			} else if (ballRotationSpd.y) {
			  ballRotationSpd.z = ballRotationSpd.y;
			  ballRotationSpd.y = 0;
			} else if (ballRotationSpd.z) {
			  ballRotationSpd.x = ballRotationSpd.z;
			  ballRotationSpd.z = 0;
			}
		  }
	  
		  // Right paddle
		  if ((ball.position.x > rightPaddle.position.x - paddleWidth / 2 && ball.position.x < rightPaddle.position.x + paddleWidth / 2) &&
			ball.position.z > rightPaddle.position.z - paddleHalfDepth && ball.position.z < rightPaddle.position.z + paddleHalfDepth) {
			// onCollide();
			ballDirX = -ballDirX;
		  }
	  
	  
		  //Left Paddle
		  if ((ball.position.x < leftPaddle.position.x + paddleWidth / 2 && ball.position.x > leftPaddle.position.x - paddleWidth / 2) &&
			ball.position.z > leftPaddle.position.z - paddleHalfDepth && ball.position.z < leftPaddle.position.z + paddleHalfDepth) {
			// onCollide();
			ballDirX = -ballDirX;
		  }
	  
	  
	  
		  // if ball goes beyond letf or right edeg, score ++
		  if (ball.position.x > (boardWidth / 2 + sphereData.radius)) {
			// Left player scores
			leftScore += 1;
			leftScoreElement.innerHTML = `Left: ${leftScore}`;
			resetBall();
	  
		  } else if (ball.position.x < (-boardWidth / 2 - sphereData.radius)) {
			// Right player scores
			rightScore += 1;
			rightScoreElement.innerHTML = `Right: ${rightScore}`;
			resetBall();
		  }
	  
		  // ball self rotation
		  ball.rotation.x += 0.01;
		  ball.rotation.y += 0.01;
	  
		  renderer.render(scene, camera);
		}
	  
		animate();
}

export async function loadVsHumanGame() {
	// get the name of the second player	
	await getChallenger();
}