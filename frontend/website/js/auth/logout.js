import { getCookie } from "../tools/tools.js";

export function doLogout() {

	// Asks for confirmation
	const confirmed = window.confirm('Are you sure you want to log out?');
	if (!confirmed) {
		// If the user cancels, exit the function
		return;
	}

	localStorage.clear()
	location.reload()
}

export function setupLogout() {
	const logoutButton = document.getElementById('logoutButton');
	if (logoutButton) {
		logoutButton.addEventListener('click', doLogout);
	} else {
		console.log("logout button not found");
	}
}