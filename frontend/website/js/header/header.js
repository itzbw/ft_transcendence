import { loadContent } from "../tools/tools.js";
import { applyLanguage } from "../tools/language.js";
import { doLogout } from "../auth/logout.js";
import { showUserProfile } from "../users/user_profile.js";
import { leaderboard } from "../users/leaderboard.js";


// Sets events listeners for the header's buttons
function setHeaderEvents(username){

	// Profile button
	const profileButton = document.getElementById('profileButton');
	if (profileButton) {
		profileButton.addEventListener('click', () => {
			showUserProfile(username);
			history.pushState({ page: 'profile', username: username }, '', '#profile');
		});
	} else {
		console.log('no profile button found');
	}

	// Play button


	// Leaderboard button
	const leaderboardButton = document.getElementById('leaderboardButton');
	if (leaderboardButton) {
		leaderboardButton.addEventListener('click', () => {
			history.pushState({ page: 'leaderboard' }, '', '#leaderboard');
			leaderboard();
		});
	} else {
		console.log("leaderboard button not found");
	}

	// Logout button
	const logoutButton = document.getElementById('logoutButton');
	if (logoutButton) {
		logoutButton.addEventListener('click', doLogout);
	} else {
		console.log("logout button not found");
	}
}

// Load the correct header
export async function setHeader(status){
	if (status.isAuthenticated == true){
		await loadContent('static/header/header_full.html', 'header', applyLanguage)
		setHeaderEvents(status.username);
	} else {
		await loadContent('static/header/header_mini.html', 'header', applyLanguage)
	}
}

// Handling popstate
window.addEventListener('popstate', (event) => {
	if (event.state) {
		const page = event.state.page;
		const username = event.state.username;

		switch(page) {
			case 'profile':
				if (username) {
					showUserProfile(username);  // assuming username is stored somewhere globally
				} else {
					console.log("no user found with this name");
				}
				break;
			case 'leaderboard':
				leaderboard();
				break;
			default:
				document.getElementById('main-box').innerHTML = ''; // Default to main menu
		}
	}
});