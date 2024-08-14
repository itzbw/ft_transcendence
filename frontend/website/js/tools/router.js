import { showUserProfile } from "../users/user_profile.js";
import { leaderboard } from "../users/leaderboard.js";



// when hash is changed, will launch the concerned page
export function router() {

	// listen for hashchange event
	window.addEventListener('hashchange', () => {
		const hash = window.location.hash;
	
		switch (true) {
			case hash.startsWith('#profile/'):
				const prefixLength = '#profile/'.length;
				const username = hash.substring(prefixLength);
				showUserProfile(username);
				break;
			case hash === '#leaderboard':
				leaderboard();
				break;
			default:
				document.getElementById('main-box').innerHTML = ''; // Default to main menu
		}
	});
}

