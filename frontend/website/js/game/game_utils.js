import * as THREE from 'three'; 
import { getCookie, getAccessToken } from "../tools/tools.js";
import { applyLanguage } from "../tools/language.js";
import { checkLoginStatus } from "../auth/status.js";
import { loadVsBotGame } from "./game_vs_bot.js";
import { vsHumanGame } from './game_vs_human.js';
import {
	scoreLimit,
	paddleWidth, paddleHeight, paddleDepth,
	sphereData,
	boardWidth, boardLength,
	leftScoreElement,
	rightScoreElement,
	instructionElement
} from "./game_config.js";

// Display the winner and the button
function showWinner(winnerName, playerTwoName) {
	const container = document.getElementById('main-box');
	if (!container) {
		console.log("main-box not found");
		return ;
	}

	// empty the box
	container.innerHTML = '';

	// create div 
	const div = document.createElement('div');
	div.classList.add("container", "d-flex", "flex-column", "align-items-center");

	// create text
	const p = document.createElement('p');
	const span = document.createElement('span');
	p.innerHTML = winnerName;
	span.setAttribute('data-translate', 'wins');
	p.appendChild(span);

	
	// create button
	const retryButton = document.createElement('button');
	retryButton.setAttribute('data-translate', 'playagain');
	retryButton.id = 'retryButton';
	if (window.location.hash === '#pongvsbot') {
		retryButton.addEventListener('click', loadVsBotGame);
	} else if (window.location.hash === '#pongvsman') {
		retryButton.addEventListener('click', () => vsHumanGame(playerTwoName));
	}

	// add text & button to div
	div.appendChild(p);
	div.appendChild(retryButton);

	// add the div to main-box
	container.appendChild(div);

	// apply language
	applyLanguage();
}

// Sends the results of the game to the backend server
export async function saveGameResult(playerOneName, playerOneScore, playerTwoName, playerTwoScore) {

	const gameData = {
		player1Name: playerOneName,
		player1Score: playerOneScore,
		player2Name: playerTwoName,
		player2Score: playerTwoScore
	};

	try {

		const response = await fetch('/api/users/save_game/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': getCookie('csrftoken'),
				'Authorization': `Bearer ${getAccessToken()}`,
			},
			body: JSON.stringify(gameData),
		});

		if (!response.ok) {
			throw new Error('Failed to save game result');
		}
	} catch (error) {
		console.log('Error when sending score:', error);
	}
}

// function to call from game when game is over
export async function handleEndGame(playerOneName, playerOneScore, playerTwoName, playerTwoScore) {
	showWinner(playerOneScore > playerTwoScore ? playerOneName : playerTwoName, playerTwoName);
	await saveGameResult(playerOneName, playerOneScore, playerTwoName, playerTwoScore);
}

// returns the username of the connected user
export async function getPlayerName() {
	const data = await checkLoginStatus();
	return (data.username); 
}

// clean score/instructions HTML elements
export function cleanHTMLElements() {
	rightScoreElement.innerHTML = "";
	leftScoreElement.innerHTML = "";
	instructionElement.innerHTML = "";
}

// display the score/instructions HTML elements
export function showHTMLElements(gameContainer, leftPlayerName, rightPlayerName) {

	// left part
	leftScoreElement.style.position = 'absolute';
	leftScoreElement.style.top = '50%';
	leftScoreElement.style.left = '10px';
	leftScoreElement.style.color = 'white';
	leftScoreElement.style.fontSize = '24px';
	leftScoreElement.innerHTML = leftPlayerName + ': 0';
	gameContainer.appendChild(leftScoreElement);
	
	// right part
	rightScoreElement.style.position = 'absolute';
	rightScoreElement.style.top = '50%';
	rightScoreElement.style.right = '10px';
	rightScoreElement.style.color = 'white';
	rightScoreElement.style.fontSize = '24px';
	rightScoreElement.innerHTML =  rightPlayerName + ': 0';
	gameContainer.appendChild(rightScoreElement);
	
	// control part
	instructionElement.style.position = "absolute";
	instructionElement.style.top = "80%";
	instructionElement.style.left = "40%";
	instructionElement.style.color = "white";
	instructionElement.style.fontSize = "18px";
	instructionElement.innerHTML = "use W & S or ⬆ & ⬇ to control <br\> First score " + scoreLimit + " to win ";
	gameContainer.appendChild(instructionElement);
}

// #region Init

// create a paddle
export function createPaddle(paddleColor) {
	const paddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
	const paddleMaterial = new THREE.MeshStandardMaterial({ color: paddleColor });
	const paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
	return (paddle);
}

// create a group for paddles
export function groupPaddles(leftPaddle, rightPaddle) {
	const groupPaddle = new THREE.Group();
	groupPaddle.add(leftPaddle);
	groupPaddle.add(rightPaddle);
	return groupPaddle;
}

// create a ball
export function createBall() {
	const sphereGeometry = new THREE.SphereGeometry(sphereData.radius);
	const sphereMaterial = new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load("../img/moon.jpg"), color: 0xffaaff });
	const ball = new THREE.Mesh(sphereGeometry, sphereMaterial);
	return (ball);
}

// Camera
export function createCamera() {
	const camera = new THREE.PerspectiveCamera(
		60, // Field of view
		window.innerWidth / window.innerHeight, // Aspect ratio
		0.1, // Near clipping plane
		1000 // Far clipping plane
	);
	camera.position.z = 8;
	camera.position.y = 8;
	camera.lookAt(0, 0, 0);
	return (camera);
}

// create the board
export function createBoard() {
	const boardGeometry = new THREE.BoxGeometry(boardWidth, 0.2, boardLength, 10, 10, 10); // Width, height (depth), length
	const boardMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: true }); // Brown color for the board
	const board = new THREE.Mesh(boardGeometry, boardMaterial);
	board.position.y = -0.1;
	return (board);
}

// #endregion


// Redraw
export function redraw(ball) {
	let newGeometry = new THREE.SphereGeometry(
	sphereData.radius,
	)
	ball.geometry.dispose()
	ball.geometry = newGeometry
}

// #region keyboard and mouse events
// setup events on mouse
export function setupMouseListeners(gameData) {
	let mouseX = 0;
	let mouseY = 0;

	function onDocumentMouseMove(event) {
		mouseX = (event.clientX / window.innerWidth) * 2 - 1;
		mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
	}

	document.addEventListener('mousemove', onDocumentMouseMove);
}

// set events on keyboard (VS BOT)
export function setupKeyboardListeners(gameData) {
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

// #endregion

// reset the ball
export function resetBall(gameData) {
	gameData.ball.position.set(0, 0.1, 0);
	gameData.ballDirX = (Math.random() > 0.5 ? 0.1 : -0.1); // random direction
	gameData.ballDirZ = (Math.random() - 0.5) * 0.2; // random direction
}

// destroy
export function destroy(scene, animFrameId) {
	scene.remove.apply(scene, scene.children);
	cancelAnimationFrame(animFrameId);
}
