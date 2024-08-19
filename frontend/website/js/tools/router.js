import { showUserProfile } from "../users/user_profile.js";
import { leaderboard } from "../users/leaderboard.js";
import { setGameModeSelection } from "../game/select_game_mode.js";
import { loadVsBotGame } from "../game/game_vs_bot.js";
import { loadVsHumanGame } from "../game/game_vs_human.js";
import { initTournament } from "../game/tournament/init_tournament.js";

import { register } from "../auth/register.js";
import { login } from  "../auth/login.js";

// Check hash in case user is not logged in
function checkHashMini(hash) {

	switch (true) {

		case hash === '#register':
			register();
			break;

		default:
			login();
	}

}

// Check hash an perform the correct action
function checkHash(hash) {
	switch (true) {

		// profile
		case hash.startsWith('#profile/'):
			const prefixLength = '#profile/'.length;
			const username = hash.substring(prefixLength);
			showUserProfile(username);
			break;

		// leaderboard
		case hash === '#leaderboard':
			leaderboard();
			break;

		// game mode selection
		case hash === '#game-menu':
			setGameModeSelection();
			break;

		// pong VS bot
		case hash === "#pongvsbot":
			loadVsBotGame();
			break;

		// pong VS man
		case hash === "#pongvsman":
			loadVsHumanGame();
			break;

		// tournament
		case hash === "#tournament":
			initTournament();
			break;

		// default
		default:
			document.getElementById('main-box').innerHTML = ''; // Default to main menu
	}
}

// when hash is changed, will launch the concerned page
export function router(isAuthenticated) {
	
	const hashHandler = isAuthenticated ? checkHash : checkHashMini;

	const hash = window.location.hash;
	hashHandler(hash);

	// listen for hashchange event
	window.addEventListener('hashchange', () => {
		const newHash = window.location.hash;
		hashHandler(newHash);
	});
}
