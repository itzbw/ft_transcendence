import { applyLanguage } from "../../tools/language.js";
import { loadContent } from "../../tools/tools.js";
import { shufflePlayers, initBrackets } from "./init_tournament.js";
import { startTournamentMatch } from "./game_tournament.js";


// create a single bracket
function createSingleBracket(matchNumber, match) {

	// get the container to insert the full bracket
	const bracketBox = document.getElementById('bracketMatch' + matchNumber);

	// first player
	const firstPlayerElement = document.createElement('p');
	firstPlayerElement.classList.add('text-center');
	if (match.winner && match.player1 == match.winner) {
		firstPlayerElement.classList.add("bi", "bi-trophy", "fw-bold");
		firstPlayerElement.innerHTML = ' ' + match.winner;
	} else if (match.player1 == null) {
		firstPlayerElement.innerHTML = '??';
	} else {
		firstPlayerElement.innerHTML = match.player1;
	}

	// second player
	const secondPlayerElement = document.createElement('p');
	secondPlayerElement.classList.add('text-center');
	if (match.winner && match.player2 == match.winner) {
		secondPlayerElement.classList.add("bi", "bi-trophy", "fw-bold");
		secondPlayerElement.innerHTML = ' ' + match.winner;
	} else if (match.player2 == null) {
		secondPlayerElement.innerHTML = '??';
	} else {
		secondPlayerElement.innerHTML = match.player2;
}
	bracketBox.appendChild(firstPlayerElement);
	bracketBox.appendChild(secondPlayerElement);
}


// show the intermatch brackets display
async function showBrackets(tournamentData) {
	await loadContent('static/game/tournament/brackets.html', 'main-box', applyLanguage);

	createSingleBracket(1, tournamentData.match1);
	createSingleBracket(2, tournamentData.match2);
	createSingleBracket(3, tournamentData.match3);
}

// fill the message and button part of the template and listen to button click
async function showNext(tournamentData) {

	const messageTitle = document.getElementById('tournamentBracketMessageTitle');
	const messageContent = document.getElementById('tournamentBracketMessageContent');
	const button = document.getElementById('tournamentBracketButton');

	if (tournamentData.match3.winner) {
		messageTitle.setAttribute('data-translate', 'tournamentwinner');
		messageContent.innerText = tournamentData.match3.winner;
		messageContent.classList.add('fw-bold');
		button.setAttribute('data-translate', 'restarttournament');
		button.addEventListener('click', async () => {
			await shufflePlayers(tournamentData.players);
			await initBrackets(tournamentData);
			startTournament(tournamentData);
			button.removeEventListener('click', showNext);
		});
	} else {
		messageTitle.setAttribute('data-translate', 'nextmatch');
		messageContent.innerText = `${tournamentData[`match${tournamentData.nextMatch}`].player1} VS ${tournamentData[`match${tournamentData.nextMatch}`].player2}`;
		button.setAttribute('data-translate', 'nextmatch');
		button.addEventListener('click', async () => {
			startTournamentMatch(tournamentData, tournamentData[`match${tournamentData.nextMatch}`]);
			button.removeEventListener('click', showNext);
		});
	}
	applyLanguage();
}


// Once tournament initialization is done, start tournament
export async function startTournament(tournamentData) {
	try {
		await showBrackets(tournamentData);
		await showNext(tournamentData);
	} catch (error) {
		console.log("error starting tournament:", error);
	}
}

// Handle the return of the tournament EndGame function
export async function handleMatchResult(tournamentData, matchPlayed, winner) {
	tournamentData[`match${matchPlayed}`].winner = winner;
	if (matchPlayed < 3) {
		tournamentData.nextMatch = matchPlayed + 1;
		if (matchPlayed == 1) {
			tournamentData.match3.player1 = winner;
		} else {
			tournamentData.match3.player2 = winner;
		}
	}
	await showBrackets(tournamentData);
	showNext(tournamentData);
}

