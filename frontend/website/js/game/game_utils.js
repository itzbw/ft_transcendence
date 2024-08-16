import * as THREE from 'three'; 
import { getCookie, getAccessToken } from "../tools/tools.js";
import { applyLanguage } from "../tools/language.js";
import { checkLoginStatus } from "../auth/status.js";
import { loadVsBotGame } from "./game_vs_bot.js";
import {
	scoreLimit,
	paddleWidth, paddleHeight, paddleDepth,
	sphereData,
	leftScoreElement,
	rightScoreElement,
	instructionElement
} from "./game_config.js";


// todo : adapt to say "next match" OR "retry", instead of just "retry"
// Display the winner and the button
function showWinner(winnerName) {
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
	retryButton.addEventListener('click', loadVsBotGame);

	// add text & button to div
	div.appendChild(p);
	div.appendChild(retryButton);

	// add the div to main-box
	container.appendChild(div);

	// apply language
	applyLanguage();
}

// Sends the results of the game to the backend server
async function saveGameResult(playerOneName, playerOneScore, playerTwoName, playerTwoScore) {

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
		const data = await response.json();
	} catch (error) {
		console.log('Error when sending score:', error);
	}
}

// function to call from game when game is over
export async function handleEndGame(playerOneName, playerOneScore, playerTwoName, playerTwoScore) {
	showWinner(playerOneScore > playerTwoScore ? playerOneName : playerTwoName);
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