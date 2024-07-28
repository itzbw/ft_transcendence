export async function checkLoginStatus() {
	try {
		const response = await fetch('/authentication/status/', {
			method: 'GET',
			credentials: 'include'
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