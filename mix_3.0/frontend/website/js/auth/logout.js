import { getCookie } from "../csrf_token.js";

function doLogout() {

	// Asks for confirmation
    const confirmed = window.confirm('Are you sure you want to log out?');
    if (!confirmed) {
        // If the user cancels, exit the function
        return;
    }

	const csrftoken = getCookie('csrftoken');

	// send a disconnection request
	fetch('/authentication/logout/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrftoken,
		},
	})
	.then(response => {
		if (!response.ok){
			throw new Error('Network response for logout was not ok');
		}
		return (response.json());
	})
	.then(data => {
		console.log("User disconnected successfully:", data);

		// redirect to homepage
		window.location.href = '/';
		location.reload();
	})
		// Error handling
		.catch(error => console.error('Error:', error));
}

export function setupLogout(){
	const logoutButton = document.getElementById('logoutButton');
	if (logoutButton) {
		logoutButton.addEventListener('click', doLogout);
	} else {
		console.log("logout button not found");
	}
}
