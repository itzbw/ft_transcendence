import { applyLanguage } from "../../tools/language.js";
import { loadContent } from "../../tools/tools.js";

// create a single bracket
function createSingleBracket(matchNumber, match) {

	// get the container to insert the full bracket
	const bracketBox = document.getElementById('bracketMatch' + matchNumber);

	// first player
	const firstPlayerElement = document.createElement('p');
	firstPlayerElement.classList.add('text-center');
	if (match.winner && match.player1 == match.winner) {
		firstPlayerElement.classList.add("bi", "bi-trophy", "font-weight-bold");
	} else if (match.player1 == null) {
		firstPlayerElement.innerHTML = '??';
	} else {
		firstPlayerElement.innerHTML = match.player1;
	}

	// second player
	const secondPlayerElement = document.createElement('p');
	secondPlayerElement.classList.add('text-center');
	if (match.winner && match.player2 == match.winner) {
		secondPlayerElement.classList.add("bi", "bi-trophy", "font-weight-bold");
	} else if (match.player2 == null) {
		secondPlayerElement.innerHTML = '??';
	} else {
		secondPlayerElement.innerHTML = match.player2;
}
console.log(match);
	bracketBox.appendChild(firstPlayerElement);
	bracketBox.appendChild(secondPlayerElement);
}


// show the intermatch brackets display
async function showBrackets(tournamentData) {
	await loadContent('static/game/tournament/brackets.html', 'main-box', applyLanguage);


	// HERE
	// Needs to implement the logique of the match following
	createSingleBracket(1, tournamentData.match1);
	createSingleBracket(2, tournamentData.match2);
	createSingleBracket(3, tournamentData.match3);
}


// Once tournament initialization is done, start tournament
export async function startTournament(tournamentData) {
	showBrackets(tournamentData);
}

