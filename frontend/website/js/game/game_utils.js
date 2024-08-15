import { getCookie } from "../tools/tools.js";
import { applyLanguage } from "../tools/language.js";
import { checkLoginStatus } from "../auth/status.js";
import { loadVsBotGame } from "./game_vs_bot.js";

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
				'X-CSRFToken': getCookie('csrftoken')
			},
			body: JSON.stringify(gameData),
		});

		if (!response.ok) {
			throw new Error('Failed to save game result');
		}
		const data = await response.json();
		console.log(data.message);
	} catch (error) {
		console.log('Error when sending score:', error);
	}
}


export async function handleEndGame(playerOneName, playerOneScore, playerTwoName, playerTwoScore) {
	showWinner(playerOneScore > playerTwoScore ? playerOneName : playerTwoName);
	await saveGameResult(playerOneName, playerOneScore, playerTwoName, playerTwoScore);
}


export async function getPlayerName() {
	const data = await checkLoginStatus();
	return (data.username); 
}

