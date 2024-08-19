import { getCookie } from "../tools/tools.js";

export async function checkDatabaseEmpty() {
	try {
		const response = await fetch('/api/authentication/check_database/');

		if (response.ok) {
			const data = await response.json();

			if (data.users_exist) {
				return (false);
			} else {
				return (true);
			}
		} else {
			console.error('Error: Response not ok:', response.status, response.statusText);
			return (true);
		}
	} catch (error) {
		console.error('Error checking users existence:', error);
		return (true);
	}
}

export async function checkLoginStatus() {

	// check if there is at least one existing user
	const db = await checkDatabaseEmpty();
	if (db) {
		return {
			'isAuthenticated': false,
			'username': null
		}
	}

	// get the status
	try {
		const jwt = localStorage.getItem("access_token");
		const response = await fetch('/api/authentication/status/', {
			method: 'GET',
			headers: {
				'X-CSRFToken': getCookie('csrftoken'),
				Authorization: jwt ? `Bearer ${jwt}` : undefined
			}
		});

		if (response.ok) {
			const result = await response.json();
			return result;
		} else {
			console.error('Error: Response not ok: ', response.status, response.statusText);
			return false;
		}
	} catch (error) {
		console.error('Error checking login status:', error);
		return false;
	}
}