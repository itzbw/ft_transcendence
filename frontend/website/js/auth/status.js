export async function checkLoginStatus() {
	const jwt = localStorage.getItem('access_token')
	try {
		const response = await fetch('https://localhost:8000/authentication/status/', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${jwt}`
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