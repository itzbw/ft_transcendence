import { loadContent } from "../tools/tools.js";
import { applyLanguage } from "../tools/language.js";
import { doLogout } from "../auth/logout.js";


// Sets events listeners for the header's buttons (profile and logout)
function setHeaderEvents(username){

	// Profile button
	const profileButton = document.getElementById('profileButton');
	if (profileButton) {

		// set the href of the profile button
		const profileURL = '#profile/' + username;
		profileButton.setAttribute('href', profileURL);

	} else {
		console.log('no profile button found');
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
		await loadContent('static/header/header_full.html', 'header', applyLanguage);
		setHeaderEvents(status.username);
	} else {
		await loadContent('static/header/header_mini.html', 'header', applyLanguage)
	}
}
