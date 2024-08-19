import { getCookie } from "../tools/tools.js"

export async function checkLoginStatus() {
	try {
		const jwt = localStorage.getItem("access_token");
		if (jwt) {
			const response = await fetch('/api/authentication/status/', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${jwt}`,
				}
			});
			if (response.ok) {
				const result = await response.json();
				return result;
			} else {
				console.error('Error: Response not ok: ', response.status, response.statusText);
				return false;
			}
		} else {
			const response = await fetch('/api/authentication/status/', {
				method: 'GET',
			});
			if (response.ok) {
				const result = await response.json();
				return result;
			} else {
				console.error('Error: Response not ok: ', response.status, response.statusText);
				return false;
			}
		}
	} catch (error) {
		console.error('Error checking login status:', error);
		return false;
	}
}