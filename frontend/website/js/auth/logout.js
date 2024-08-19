import { getCookie, getAccessToken } from "../tools/tools.js";

export function doLogout() {

	// Asks for confirmation
	const confirmed = window.confirm('Are you sure you want to log out?');
	if (!confirmed) {
		// If the user cancels, exit the function
		return;
	} else {
		localStorage.clear();
		location.hash = '#login'
		location.reload();
	}

	// send a disconnection request
	fetch('/api/authentication/logout/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': getCookie('csrftoken'),
			'Access-Control-Allow-Methods': 'POST, GET, DELETE',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': Content-Type,
		},
	})
		.then(response => {
			if (!response.ok) {
				console.log(response);
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
