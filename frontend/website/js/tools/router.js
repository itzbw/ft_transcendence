import { showUserProfile } from "../users/user_profile.js";
import { leaderboard } from "../users/leaderboard.js";
import { setGameModeSelection } from "../game/select_game_mode.js";
import { loadVsBotGame } from "../game/game_vs_bot.js";
import { loadVsHumanGame } from "../game/game_vs_human.js";

// when hash is changed, will launch the concerned page
export function router() {

	// listen for hashchange event
	window.addEventListener('hashchange', () => {
		const hash = window.location.hash;
	
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
				break;

			// default
			default:
				document.getElementById('main-box').innerHTML = ''; // Default to main menu
		}
	});
}

