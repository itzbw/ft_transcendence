import { loadContent } from "../tools.js";
import { applyLanguage } from "../language.js";
import { doLogout } from "../auth/logout.js";
import { showUserProfile } from "../users/user_profile.js";
import { leaderboard } from "../leaderboard.js";


// Sets events listeners for the header's buttons
function setHeaderEvents(username){

	// Profile button
	const profileButton = document.getElementById('profileButton');
	if (profileButton) {
		profileButton.addEventListener('click', () => showUserProfile(username));
	} else {
		console.log('no profile button found');
	}

	// Play button


	// Leaderboard button
	const leaderboardButton = document.getElementById('leaderboardButton');
	if (leaderboardButton) {
		leaderboardButton.addEventListener('click', leaderboard);
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
