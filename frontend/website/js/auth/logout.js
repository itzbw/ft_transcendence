import { getCookie } from "../csrf_token.js";

export function setupLogout() {

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

// Make the function accessible from html with the name "setupLogout"
window.setupLogout = setupLogout;