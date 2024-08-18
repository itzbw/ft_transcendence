// game_animation.js
import * as THREE from 'three';
import { resetBall, handleEndGame, destroy } from './game_utils.js';
import {
	scoreLimit,
	paddleSpeed, boardLength, boardWidth,
	sphereData,
	paddleWidth, paddleDepth,
	leftScoreElement, rightScoreElement,
	aiUpdateInterval
} from './game_config.js';

// main game loop for VS Bot game
export function animate_vs_bot(gameData) {
	const clock = new THREE.Clock();
	let animFrameId = null;

	function animateLoop() {
		animFrameId = requestAnimationFrame(animateLoop);
		const delta = clock.getDelta();
		const elapsedTime = clock.getElapsedTime();

		// Paddle movement based on key states
		if (gameData.keys.ArrowUp) {
			gameData.leftPaddle.position.z -= paddleSpeed * delta;
		}
		if (gameData.keys.ArrowDown) {
			gameData.leftPaddle.position.z += paddleSpeed * delta;
		}
		if (gameData.keys.KeyW) {
			gameData.leftPaddle.position.z -= paddleSpeed * delta;
		}
		if (gameData.keys.KeyS) {
			gameData.leftPaddle.position.z += paddleSpeed * delta;
		}

		// Clamp paddle position within board boundaries
		const boardHeight = 5;
		const paddleLength = 1; // Half of the paddle's height for boundary calculation
		const paddleHalfDepth = paddleDepth / 2;

		// IA Observation every 1sec
		if (elapsedTime - gameData.lastAIUpdateTime > aiUpdateInterval) {
			gameData.lastAIUpdateTime = elapsedTime;
			
			// stock position and direction of the ball
			gameData.ballPositionAtLastUpdate = { 
				x: gameData.ball.position.x, 
				z: gameData.ball.position.z 
			};
			gameData.ballDirAtLastUpdate = { 
				x: gameData.ballDirX, 
				z: gameData.ballDirZ 
			};
		}

		// move right paddle using informations
		const ballPosition = gameData.ballPositionAtLastUpdate;
		const ballDir = gameData.ballDirAtLastUpdate;

		// Estimate future ball position
		const futureBallPosition = {
			x: ballPosition.x + ballDir.x * paddleSpeed,
			z: ballPosition.z + ballDir.z * paddleSpeed
		};

		if (futureBallPosition.z > gameData.rightPaddle.position.z) {
			gameData.rightPaddle.position.z += paddleSpeed * delta;
		} else if (futureBallPosition.z < gameData.rightPaddle.position.z) {
			gameData.rightPaddle.position.z -= paddleSpeed * delta;
		}

			gameData.rightPaddle.position.z = THREE.MathUtils.clamp(
			gameData.rightPaddle.position.z,
			-boardHeight + (boardHeight / 2 + paddleLength / 2),
			boardHeight - (boardHeight / 2 + paddleLength / 2)
		);

		gameData.leftPaddle.position.z = THREE.MathUtils.clamp(
			gameData.leftPaddle.position.z,
			-boardHeight + (boardHeight / 2 + paddleLength / 2),
			boardHeight - (boardHeight / 2 + paddleLength / 2)
		);

		const ballSpeed = 20;
		gameData.ball.position.x += gameData.ballDirX * ballSpeed * delta;
		gameData.ball.position.z += gameData.ballDirZ * ballSpeed * delta;

		// Ball collision with top and bottom wall
		if (gameData.ball.position.z > boardLength / 2 || gameData.ball.position.z < -boardLength / 2) {
			gameData.ballDirZ = -gameData.ballDirZ;
		}

		// Ball collision with the paddle
		const onCollide = () => {
			if (gameData.ballRotationSpd.x) {
				gameData.ballRotationSpd.y = gameData.ballRotationSpd.x;
				gameData.ballRotationSpd.x = 0;
				gameData.ballDirX *= 1.5; // Increase speed when colliding with paddle
			} else if (gameData.ballRotationSpd.y) {
				gameData.ballRotationSpd.z = gameData.ballRotationSpd.y;
				gameData.ballRotationSpd.y = 0;
			} else if (gameData.ballRotationSpd.z) {
				gameData.ballRotationSpd.x = gameData.ballRotationSpd.z;
				gameData.ballRotationSpd.z = 0;
				gameData.ballDirZ *= 1.5; // Increase speed when colliding with paddle
			}
		};

		if (((gameData.ball.position.x + sphereData.radius) > gameData.rightPaddle.position.x - paddleWidth / 2 &&
			(gameData.ball.position.z + sphereData.radius) > gameData.rightPaddle.position.z - paddleDepth / 2 &&
			(gameData.ball.position.z - sphereData.radius) < gameData.rightPaddle.position.z + paddleDepth / 2)) {
			onCollide();
			gameData.ballDirX = -gameData.ballDirX;
		}

		if (((gameData.ball.position.x - sphereData.radius) < gameData.leftPaddle.position.x + paddleWidth / 2 &&
			(gameData.ball.position.z + sphereData.radius) > gameData.leftPaddle.position.z - paddleHalfDepth &&
			(gameData.ball.position.z - sphereData.radius) < gameData.leftPaddle.position.z + paddleHalfDepth)) {
			onCollide();
			gameData.ballDirX = -gameData.ballDirX;
		}

		function onGoal() {
			const leftWon = gameData.leftScore >= scoreLimit;
			const rightWon = gameData.rightScore >= scoreLimit;
			if (leftWon || rightWon) {
				handleEndGame(gameData.player, gameData.leftScore, 'Marvin', gameData.rightScore);
				destroy(gameData.scene, animFrameId, gameData.gui);
			}
		}

		// Score update and reset ball
		if (gameData.ball.position.x >= boardWidth / 2 + paddleWidth) {
			gameData.leftScore++;
			leftScoreElement.innerHTML = gameData.leftScore;
			resetBall(gameData);
			onGoal();
		} else if (gameData.ball.position.x <= -(boardWidth / 2 + paddleWidth)) {
			gameData.rightScore++;
			rightScoreElement.innerHTML = gameData.rightScore;
			resetBall(gameData);
			onGoal();
		}

		gameData.renderer.render(gameData.scene, gameData.camera);
		gameData.controls.update();

		window.addEventListener('hashchange', function () {
			destroy(gameData.scene, animFrameId);
		});
	}

	animateLoop();
}

// main game loop for VS Human game
export function animate_vs_human(gameData) {
	const clock = new THREE.Clock();
	let animFrameId = null;

	function animateLoop() {
		animFrameId = requestAnimationFrame(animateLoop);
		const delta = clock.getDelta();

		// Paddle movement based on key states
		if (gameData.keys.ArrowUp) {
			gameData.rightPaddle.position.z -= paddleSpeed * delta;
		}
		if (gameData.keys.ArrowDown) {
			gameData.rightPaddle.position.z += paddleSpeed * delta;
		}
		if (gameData.keys.KeyW) {
			gameData.leftPaddle.position.z -= paddleSpeed * delta;
		}
		if (gameData.keys.KeyS) {
			gameData.leftPaddle.position.z += paddleSpeed * delta;
		}

		// Clamp paddle position within board boundaries
		const boardHeight = 5;
		const paddleLength = 1; // Half of the paddle's height for boundary calculation
		const paddleHalfDepth = paddleDepth / 2;
		gameData.rightPaddle.position.z = THREE.MathUtils.clamp(gameData.rightPaddle.position.z, -boardHeight + (boardHeight / 2 + paddleLength / 2), boardHeight - (boardHeight / 2 + paddleLength / 2));
		gameData.leftPaddle.position.z = THREE.MathUtils.clamp(gameData.leftPaddle.position.z, -boardHeight + (boardHeight / 2 + paddleLength / 2), boardHeight - (boardHeight / 2 + paddleLength / 2));

		const ballSpeed = 20;
		gameData.ball.position.x += gameData.ballDirX * ballSpeed * delta;
		gameData.ball.position.z += gameData.ballDirZ * ballSpeed * delta;

		// ball collision with top and bottom all
		if (gameData.ball.position.z > boardLength / 2 || gameData.ball.position.z < -boardLength / 2) {
			gameData.ballDirZ = -gameData.ballDirZ;
		}
		
		// ball collision with the paddle
		const onCollide = () => {
			if (gameData.ballRotationSpd.x) {
				gameData.ballRotationSpd.y = gameData.ballRotationSpd.x;
				gameData.ballRotationSpd.x = 0;
				gameData.ballDirX *= 1.5; // increase speed when collide with paddle
			} else if (gameData.ballRotationSpd.y) {
				gameData.ballRotationSpd.z = gameData.ballRotationSpd.y;
				gameData.ballRotationSpd.y = 0;
			} else if (gameData.ballRotationSpd.z) {
				gameData.ballRotationSpd.x = gameData.ballRotationSpd.z;
				gameData.ballRotationSpd.z = 0;
				gameData.ballDirZ *= 1.5; //increase speed when collide with paddle
			}
		};


		if (((gameData.ball.position.x + sphereData.radius) > gameData.rightPaddle.position.x - paddleWidth / 2 &&
		(gameData.ball.position.z + sphereData.radius) > gameData.rightPaddle.position.z - paddleDepth / 2 &&
		(gameData.ball.position.z - sphereData.radius) < gameData.rightPaddle.position.z + paddleDepth / 2)) {
		onCollide();
		gameData.ballDirX = -gameData.ballDirX;
		}

		if (((gameData.ball.position.x - sphereData.radius) < gameData.leftPaddle.position.x + paddleWidth / 2 &&
			(gameData.ball.position.z + sphereData.radius) > gameData.leftPaddle.position.z - paddleHalfDepth &&
			(gameData.ball.position.z - sphereData.radius) < gameData.leftPaddle.position.z + paddleHalfDepth)) {
			onCollide();
			gameData.ballDirX = -gameData.ballDirX;
		}

		function onGoal() {
			const leftWon = gameData.leftScore >= scoreLimit;
			const rightWon = gameData.rightScore >= scoreLimit;
			if (leftWon || rightWon) {
				handleEndGame(gameData.player, gameData.leftScore, gameData.challenger, gameData.rightScore);
				destroy(gameData.scene, animFrameId, gameData.gui);
			}
		}

		// Score update and reset ball
		if (gameData.ball.position.x >= boardWidth / 2 + paddleWidth) {
			gameData.leftScore++;
			leftScoreElement.innerHTML = gameData.leftScore;
			resetBall(gameData);
			onGoal();
		} else if (gameData.ball.position.x <= -(boardWidth / 2 + paddleWidth)) {
			gameData.rightScore++;
			rightScoreElement.innerHTML = gameData.rightScore;
			resetBall(gameData);
			onGoal();
		}

		gameData.renderer.render(gameData.scene, gameData.camera);
		gameData.controls.update();

		window.addEventListener('hashchange', function () {
			destroy(gameData.scene, animFrameId);
		});
	}

	animateLoop();
}

