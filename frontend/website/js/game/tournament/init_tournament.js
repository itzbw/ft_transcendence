import { applyLanguage } from "../../tools/language.js";
import { loadContent } from "../../tools/tools.js";
import { getPlayerName } from "../game_utils.js";
import { startTournament } from "./process_tournament.js";


// sets Match Brackets
export function initBrackets(tournamentData) {
	tournamentData.nextMatch = 1;
	tournamentData.match1 = {
		player1: tournamentData.players.player1,
		player2: tournamentData.players.player2,
		winner: null,
	};
	tournamentData.match2 = {
		player1: tournamentData.players.player3,
		player2: tournamentData.players.player4,
		winner: null,
	};
	tournamentData.match3 = {
		player1: null,
		player2: null,
		winner: null,
	};
}


// shuffle players to avoid to know who start against who
export function shufflePlayers(players) {

    // Extract players ignoring keys
    const playersArray = Object.values(players);

    // Shuffle the players
    shuffleArray(playersArray);

    // Reassign them
    players.player1 = playersArray[0];
    players.player2 = playersArray[1];
    players.player3 = playersArray[2];
    players.player4 = playersArray[3];

	// function to shuffle an array
	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}
}

// Display the Start tournament button
function showStartButton(tournamentData) {
	const box = document.getElementById('tournamentInitInteractiveBox');

	if (box) {
		box.innerHTML = '';

		const readyButton = document.createElement('button');
		readyButton.setAttribute('data-translate', 'starttournament');
		box.appendChild(readyButton);
		applyLanguage();

		readyButton.addEventListener('click', async function() {
			readyButton.removeEventListener('click', showStartButton);
			initBrackets(tournamentData);
			startTournament(tournamentData);
		});
	}
}

// check the validity of the input
function isNameValid(input, players) {
	// Marvin name is reserved for the bot
	if (input === 'Marvin' || input === 'marvin') {
		return (false);
	}
	// name must have a correct length
	if (input.length < 3 || input.length > 29) {
		return (false);
	}
	// verify that the name has not already been given
	if (Object.values(players).includes(input)) {
		return false;
	}
	return (true);
}


// Display the username in the correct place
function showPlayerName(username, number) {
	const elementName = "player" + number + "Name";
	const element = document.getElementById(elementName);

	if (element) {
		element.innerHTML = username;
	}
}

// Inits the tournament
export async function initTournament() {
	// load the template
	await loadContent("/static/game/tournament/init.html", 'main-box', applyLanguage);

	const input = document.getElementById('tournamentEnterPlayerName');
	const message = document.getElementById('tournamentEnterPlayerMessage');
	let playerNum = 2;
	const tournamentData = {
		players: {
			player1: await getPlayerName(),
			player2: '',
			player3: '',
			player4: ''
		},
	};

	showPlayerName(tournamentData.players.player1, 1);

	// Listen when an username is submitted
	input.addEventListener('keydown', function(event) {
		if (event.key === 'Enter') {
			if (isNameValid(input.value, tournamentData.players)) {

				// insert it in the tournament Data
				tournamentData.players[`player${playerNum}`] = input.value;
				
				// display its name
				showPlayerName(input.value, playerNum);

				// re-init input, clean error message and increment playerNum;
				input.value = '';
				message.innerHTML = '';
				playerNum++;

				// all players are filled
				if (playerNum > 4) {
					input.removeEventListener('keydown', initTournament);
					shufflePlayers(tournamentData.players);
					showStartButton(tournamentData);
				}

			} else {
				message.setAttribute('data-translate', 'invalidusername');
				applyLanguage();
			}
		}
	});
}