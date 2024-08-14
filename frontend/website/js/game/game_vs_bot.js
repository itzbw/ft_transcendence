import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import dat from 'https://cdn.skypack.dev/dat.gui';
import dat from "./dat.gui.js"
import { loadContent } from '../tools/tools.js';

const DEFAULT_SCORE_LIMIT = 5

// return the wanted information from scene
function findObjectInScene(scene, name) {
	let foundObject = null;
	scene.traverse((object) => {
		if (object.name === name) {
			foundObject = object;
		}
	});
	return foundObject;
}


// GUI Panel
function guiPanel(scene) {
	const gui = new dat.GUI({ autoPlace: false });
	gui.close();
	gui.domElement.id = 'gui';
	gui_container.appendChild(gui.domElement);

	// Paddle size change
	const groupPaddle = findObjectInScene(scene, 'groupPaddle');
	if (groupPaddle) {
		gui.add(groupPaddle.scale, 'z', 0.5, 1).name('Paddle Size');
	}
	
	// Ball Size and color change
	const ball = findObjectInScene(scene, 'ball');
	if (ball) {

		// Ball size
		gui
		.add(ball.scale, 'x', 0.3, 1)
		.name('Ball Size')
		.onChange(redraw);

		// Ball color
		const materialBall = {
			ballColor: ball.material.color.getHex(),
		};
		gui
			.addColor(materialBall, 'ballColor')
			.name('Ball Color')
			.onChange((value) => ball.material.color.set(value));
	}
	
	// Board wireframe and color
	const board = findObjectInScene(scene, 'board');
	if (board) {

		// wireframe
		gui.add(board.material, 'wireframe').name('Board Wireframe');

		// color
		const materialBoard = {
			boardColor: board.material.color.getHex(),
		};
		gui
			.addColor(materialBoard, 'boardColor')
			.name('Board Color')
			.onChange((value) => board.material.color.set(value));
	}

	// Paddles material
	const leftPaddle = groupPaddle.children.find(child => child.name === 'leftPaddle');
	const rightPaddle = groupPaddle.children.find(child => child.name === 'rightPaddle');

	if (leftPaddle && rightPaddle) {
		// Prepare color objects for GUI
		const materialLeftPaddle = {
			leftPaddleColor: leftPaddle.material.color.getHex(),
		};
		const materialRightPaddle = {
			rightPaddleColor: rightPaddle.material.color.getHex(),
		};

		// Add color control to GUI
		gui
			.addColor(materialLeftPaddle, 'leftPaddleColor')
			.name('Left Paddle Color')
			.onChange((value) => leftPaddle.material.color.set(value));

		gui
			.addColor(materialRightPaddle, 'rightPaddleColor')
			.name('Right Paddle Color')
			.onChange((value) => rightPaddle.material.color.set(value));
	}
}

// sphere geometry
function createSphere(scene) {
	// Create a sphere geometry
	const sphereData = {
		radius: 0.3,
		widthSegments: 32,
		heightSegments: 32
	}

	const sphereGeometry = new THREE.SphereGeometry(sphereData.radius);
	const sphereMaterial = new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load("../img/moon.jpg"), color: 0xffaaff }); // Red color for the sphere
	const ball = new THREE.Mesh(sphereGeometry, sphereMaterial);

	// Add the sphere to the scene
	ball.position.set(0, 0.1, 0); // Position it at the center of the board
	scene.add(ball);
}

// create paddles
function createPaddles(scene) {

	const paddleWidth = 0.2;
	const paddleHeight = 0.5;
	const paddleDepth = 1;

	// Left paddle
	const leftPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth); // Width, height, depth
	const leftPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // Blue color for the paddles
	const leftPaddle = new THREE.Mesh(leftPaddleGeometry, leftPaddleMaterial);
	leftPaddle.position.set(-5, 0.15, 0); // Position it on the left edge of the board

	// Right paddle
	const rightPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth); // Width, height, depth
	const rightPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff }); // Blue color for the paddles
	const rightPaddle = new THREE.Mesh(rightPaddleGeometry, rightPaddleMaterial);
	rightPaddle.position.set(5, 0.15, 0); // Position it on the right edge of the board
	
	// group paddles
	const groupPaddle = new THREE.Group();
	groupPaddle.add(leftPaddle);
	groupPaddle.add(rightPaddle);
	scene.add(groupPaddle);
}

// main board
function createBoard(scene) {
	const boardWidth = 10;
	const boardLength = 5;
	const boardGeometry = new THREE.BoxGeometry(boardWidth, 0.2, boardLength, 10, 10, 10); // Width, height (depth), length
	const boardMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: true }); // Brown color for the board
	const board = new THREE.Mesh(boardGeometry, boardMaterial);
	board.position.y = -0.1;
	scene.add(board);
}

// clean
function destroy(scene) {

	// scene destruction
	scene.traverse((object) => {
		if (object instanceof THREE.Mesh) {
			object.geometry.dispose();
			object.material.dispose();
		}
	});
	scene.remove.apply(scene, scene.children);

	// animationFrame destruction
}

export async function loadVsBotGame() {

	await loadContent('static/game/game.html', 'main-box');

	// Create the scene
	let scene = new THREE.Scene();

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

	// Create a renderer and insert it in its container
	const renderer = new THREE.WebGLRenderer({ alpha: true });
	const rendererContainer = document.getElementById('rendererContainer');

	// Create a point light
	const light = new THREE.AmbientLight(0xffffff, 3);
	light.position.set(10, 10, 10);
	scene.add(light);

	// Main board
	createBoard(scene);

	// Paddles
	createPaddles(scene);

	// Sphere
	createSphere(scene);

	// variable for ball movement speed
	let ballDirX = 0.1; // width speed
	let ballDirZ = 0.1; // vertical speed
	var ballRotationSpd = { x: 0.2, y: 0, z: 0 }

	// Score
	let leftScore = 0
	let rightScore = 0;
	const scoreLimit = DEFAULT_SCORE_LIMIT;

	// GUI Panel
	guiPanel(scene);


}