import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import dat from "./dat.gui.js";
import { loadContent } from '../tools/tools.js';
import { getPlayerName, handleEndGame } from './game_utils.js';

const MAX_SCORE = 1

const leftScoreElement = document.createElement('div');
const rightScoreElement = document.createElement('div');
const instructionElement = document.createElement('div');
let scene = null;
let animFrameId = null;


export async function loadVsBotGame() {

	// load template
	await loadContent('static/game/game.html', 'main-box');

	// init values
	rightScoreElement.innerHTML = "";
	leftScoreElement.innerHTML = "";
	instructionElement.innerHTML = "";

	// get player name
	const player = await getPlayerName();

	// Create the scene
	scene = new THREE.Scene();

	// Create a camera
	const camera = new THREE.PerspectiveCamera(
		60, // Field of view
		window.innerWidth / window.innerHeight, // Aspect ratio
		0.1, // Near clipping plane
		1000 // Far clipping plane
	);
	camera.position.z = 8;
	camera.position.y = 8;
	camera.lookAt(0, 0, 0);
	
	// Create a renderer
	const renderer = new THREE.WebGLRenderer({ alpha: true });
	
	var canvas = document.getElementById('gameContainer');
	
	// renderer.setSize(window.innerWidth, window.innerHeight);
	// document.body.appendChild(renderer.domElement);
	
	canvas.innerHTML = ''; // Clear any existing content
	canvas.appendChild(renderer.domElement);
	
	// Create a point light
	const light = new THREE.AmbientLight(0xffffff, 3);
	// for rotation only
	//const light = new THREE.PointLight(0xffffff, 0.8);
	light.position.set(10, 10, 10);
	scene.add(light);
	
	// Main board
	const boardWidth = 10;
	const boardLength = 5;
	const boardGeometry = new THREE.BoxGeometry(boardWidth, 0.2, boardLength, 10, 10, 10); // Width, height (depth), length
	const boardMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: true }); // Brown color for the board
	const board = new THREE.Mesh(boardGeometry, boardMaterial);
	board.position.y = -0.1;
	scene.add(board);
	
	// Create paddles
	const paddleWidth = 0.2;
	const paddleHeight = 0.5;
	const paddleDepth = 1;
	
	
	// Left paddle
	const leftPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth); // Width, height, depth
	const leftPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // Blue color for the paddles
	const leftPaddle = new THREE.Mesh(leftPaddleGeometry, leftPaddleMaterial);
	leftPaddle.position.set(-5, 0.15, 0); // Position it on the left edge of the board
	// scene.add(leftPaddle);
	
	// Right paddle
	const rightPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth); // Width, height, depth
	const rightPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff }); // Blue color for the paddles
	const rightPaddle = new THREE.Mesh(rightPaddleGeometry, rightPaddleMaterial);
	rightPaddle.position.set(5, 0.15, 0); // Position it on the right edge of the board
	// scene.add(rightPaddle);
	
	// GROUP PADDLE //
	const groupPaddle = new THREE.Group();
	groupPaddle.add(leftPaddle);
	groupPaddle.add(rightPaddle);
	scene.add(groupPaddle);
	
	// Create a sphere geometry
	const sphereData = {
		radius: 0.3,
		widthSegments: 32,
		heightSegments: 32
	}
	
	// const sphereGeometry = new THREE.SphereGeometry(sphereData.radius, sphereData.widthSegments, sphereData.heightSegments); // Radius, width segments, height segments
	const sphereGeometry = new THREE.SphereGeometry(sphereData.radius);
	const sphereMaterial = new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load("../img/moon.jpg"), color: 0xffaaff }); // Red color for the sphere
	const ball = new THREE.Mesh(sphereGeometry, sphereMaterial);
	
	// Add the sphere to the scene
	ball.position.set(0, 0.1, 0); // Position it at the center of the board
	scene.add(ball);
	
	
	
	// variable for ball movement speed
	let ballDirX = 0.1; // width speed
	let ballDirZ = 0.1; // vertical speed
	var ballRotationSpd = { x: 0.2, y: 0, z: 0 }
	
	// Score
	let leftScore = 0
	let rightScore = 0;
	const scoreLimit = MAX_SCORE;
	
	
	
	/////////////////// HTML Score Showing /////////////////////
	leftScoreElement.style.position = 'absolute';
	leftScoreElement.style.top = '50%';
	leftScoreElement.style.left = '10px';
	leftScoreElement.style.color = 'white';
	leftScoreElement.style.fontSize = '24px';
	leftScoreElement.innerHTML = player + ': 0';
	canvas.appendChild(leftScoreElement);
	
	// const rightScoreElement = document.createElement('vsbotcontent');
	rightScoreElement.style.position = 'absolute';
	rightScoreElement.style.top = '50%';
	rightScoreElement.style.right = '10px';
	rightScoreElement.style.color = 'white';
	rightScoreElement.style.fontSize = '24px';
	rightScoreElement.innerHTML = 'Marvin: 0';
	canvas.appendChild(rightScoreElement);
	
	instructionElement.style.position = "absolute";
	instructionElement.style.top = "80%";
	instructionElement.style.left = "40%";
	instructionElement.style.color = "white";
	instructionElement.style.fontSize = "18px";
	instructionElement.innerHTML = "use W & S or ⬆ & ⬇ to control <br\> First score " + scoreLimit + " to win ";
	canvas.appendChild(instructionElement);
	
	/// GUI Panel ///
	const gui = new dat.GUI({ autoPlace: false });
	gui.close();
	gui.domElement.id = 'gui';
	gui_container.appendChild(gui.domElement);
	
	///Paddle Size Change//
	gui.add(groupPaddle.scale, 'z', 0.5, 1).name('Paddle Size');
	
	// Ball Size chnage
	gui
		.add(sphereData, 'radius', 0.3, 1)
		.name('Ball size')
		.onChange(redraw)
	// .onFinishChange(() => console.dir(ball.geometry))
	
	// Board wireframe
	gui.add(board.material, 'wireframe').name('Board Wireframe');
	
	//Paddle Color Change //
	const materialLeftPaddle = {
		leftPaddleColor: leftPaddle.material.color.getHex(),
	};
	const materialRightPaddle = {
		rightPaddleColor: rightPaddle.material.color.getHex(),
	};
	gui
		.addColor(materialLeftPaddle, 'leftPaddleColor')
		.onChange((value) => leftPaddle.material.color.set(value));
	gui
		.addColor(materialRightPaddle, 'rightPaddleColor')
		.onChange((value) => rightPaddle.material.color.set(value));
	
	// Ball Color Change //
	const materialBall = {
		ballColor: ball.material.color.getHex(),
	}
	gui
		.addColor(materialBall, 'ballColor')
		.onChange((value) => ball.material.color.set(value));
	
	// Board color
	const materialBoard = {
		boardColor: board.material.color.getHex(),
	}
	
	gui
		.addColor(materialBoard, 'boardColor')
		.onChange((value) => board.material.color.set(value));
	
	
	
	
	function redraw() {
		let newGeometry = new THREE.SphereGeometry(
		sphereData.radius,
		)
		ball.geometry.dispose()
		ball.geometry = newGeometry
	}

	var resizeRenderer = () => {
		camera.aspect = window.innerWidth / window.innerHeight;
	
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	};
	resizeRenderer();

	window.addEventListener('resize', resizeRenderer);


	// Add mouse interaction
	document.addEventListener('mousemove', onDocumentMouseMove);

	let mouseX = 0;
	let mouseY = 0;

	function onDocumentMouseMove(event) {
		mouseX = (event.clientX / window.innerWidth) * 2 - 1;
		mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
	}

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.update();


	// Key states for paddle movement
	const keys = {
		ArrowUp: false,
		ArrowDown: false,
		KeyW: false,
		KeyS: false
	};

	// Event listeners for keydown and keyup
	document.addEventListener('keydown', (event) => {
		if (event.code === 'ArrowUp') {
		keys.ArrowUp = true;
		} else if (event.code === 'ArrowDown') {
		keys.ArrowDown = true;
		} else if (event.code === 'KeyW') {
		keys.KeyW = true;
		} else if (event.code === 'KeyS') {
		keys.KeyS = true;
		}
	});

	document.addEventListener('keyup', (event) => {
		if (event.code === 'ArrowUp') {
		keys.ArrowUp = false;
		} else if (event.code === 'ArrowDown') {
		keys.ArrowDown = false;
		} else if (event.code === 'KeyW') {
		keys.KeyW = false;
		} else if (event.code === 'KeyS') {
		keys.KeyS = false;
		}
	});

	// reset ball
	function resetBall() {
		ball.position.set(0, 0.1, 0);
		ballDirX = (Math.random() > 0.5 ? 0.1 : -0.1); // random direction
		ballDirZ = (Math.random() - 0.5) * 0.2;; // random direction
	}

	// reset game
	function resetGame() {
		leftScore = 0;
		rightScore = 0;
		leftScoreElement.innerHTML = '';
		rightScoreElement.innerHTML = '';
		resetBall();
	}

	const clock = new THREE.Clock();

	// Render the scene from the perspective of the camera
	function animate(player) {
		console.log('Inside player value:', player);
		animFrameId = requestAnimationFrame(() => animate(player));
		const delta = clock.getDelta();
	
	// check winner
	// if (leftScore >= scoreLimit || rightScore >= scoreLimit) {
	// 	return;
	// } else if (rightScore >= scoreLimit) {
	// 	return;
	// }

	// Paddle movement based on key states
	const paddleSpeed = 10;
	if (keys.ArrowUp) {
		leftPaddle.position.z -= paddleSpeed * delta;
	}
	if (keys.ArrowDown) {
		leftPaddle.position.z += paddleSpeed * delta;
	}
	if (keys.KeyW) {
		leftPaddle.position.z -= paddleSpeed * delta;
	}
	if (keys.KeyS) {
		leftPaddle.position.z += paddleSpeed * delta;
	}

	// AI paddle movement

	// AI paddle movement speed
	//  determines how quickly the paddle responds to the ball's movement.
	const aiPaddleSpeed = 10;


	//checks if the ball is currently "below" the paddle on the Z-axis
	// makes the AI paddle follow the ball along the Z-axis. The paddle moves up or down based on the ball's vertical position
	if (ball.position.z > rightPaddle.position.z) {
		rightPaddle.position.z += aiPaddleSpeed * delta;
	} else if (ball.position.z < rightPaddle.position.z) {
		rightPaddle.position.z -= aiPaddleSpeed * delta;
	}

	// Clamp paddle position within board boundaries
	const boardHeight = 5;
	const paddleLength = 1; // Half of the paddle's height for boundary calculation
	const paddleHalfDepth = paddleDepth / 2;
	rightPaddle.position.z = THREE.MathUtils.clamp(rightPaddle.position.z, -boardHeight + (boardHeight / 2 + paddleLength / 2), boardHeight - (boardHeight / 2 + paddleLength / 2));
	leftPaddle.position.z = THREE.MathUtils.clamp(leftPaddle.position.z, -boardHeight + (boardHeight / 2 + paddleLength / 2), boardHeight - (boardHeight / 2 + paddleLength / 2));

	const ballSpeed = 20;

	// ball movement
	ball.position.x += ballDirX * ballSpeed * delta; // speed
	ball.position.z += ballDirZ * ballSpeed * delta; // speed

	// ball collision with top and bottom all
	if (ball.position.z > boardLength / 2 || ball.position.z < -boardLength / 2)
		ballDirZ = -ballDirZ;

	// ball collision with the paddle
	const onCollide = () => {
		if (ballRotationSpd.x) {
		ballRotationSpd.y = ballRotationSpd.x;
		ballRotationSpd.x = 0;
		ballDirX *= 1.5; // increase speed when collide with paddle
		} else if (ballRotationSpd.y) {
		ballRotationSpd.z = ballRotationSpd.y;
		ballRotationSpd.y = 0;
		} else if (ballRotationSpd.z) {
		ballRotationSpd.x = ballRotationSpd.z;
		ballRotationSpd.z = 0;
		ballDirZ *= 1.5; //increase speed when collide with paddle
		}
	}


	// Right paddle
	if (((ball.position.x + sphereData.radius) > rightPaddle.position.x - paddleWidth / 2 &&
		(ball.position.z + sphereData.radius) > rightPaddle.position.z - paddleDepth / 2 && (ball.position.z - sphereData.radius) < rightPaddle.position.z + paddleDepth / 2)) {
		onCollide();
		ballDirX = -ballDirX;
	}


	//Left Paddle
	if (((ball.position.x - sphereData.radius) < leftPaddle.position.x + paddleWidth / 2 &&
		(ball.position.z + sphereData.radius) > leftPaddle.position.z - paddleHalfDepth && (ball.position.z - sphereData.radius) < leftPaddle.position.z + paddleHalfDepth)) {
		onCollide();
		ballDirX = -ballDirX;
	}

	function onGoal() {
		const leftWon = leftScore >= scoreLimit;
		const rightWon = rightScore >= scoreLimit;
		if (leftWon || rightWon) {
			handleEndGame(player, leftScore, 'Marvin', rightScore);
			destroy();
		}
	}



	// if ball goes beyond letf or right edeg, score ++ 
	if (ball.position.x + sphereData.radius > boardWidth / 2) {
		// Left player scores
		leftScore += 1;
		leftScoreElement.innerHTML = `${player}: ${leftScore}`;
		resetBall();
		onGoal();

	} else if (ball.position.x - sphereData.radius < -boardWidth / 2) {
		// Right player scores
		rightScore += 1;
		rightScoreElement.innerHTML = `Marvin : ${rightScore}`;
		resetBall();
		onGoal();
	}

	// ball self rotation
	ball.rotation.x += 0.01 * delta;
	ball.rotation.y += 0.01 * delta;



	renderer.render(scene, camera);
	}

	animate(player);
}



window.destroy = function () {
	scene.remove.apply(scene, scene.children)
	cancelAnimationFrame(animFrameId)
	// gui.parentElement.removeChild(gui)
}

window.loadNextMatch = function () {

	loadVsBotGame();

	// console.log("load Next Match");

}


