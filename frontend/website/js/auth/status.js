import { setHeader } from "../header/header.js";

async function getLoginStatus() {
	try {
		const jwt = localStorage.getItem("access_token");
		const response = await fetch('/api/authentication/status/', {
			method: 'GET',
			headers: {
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

export async function checkLoginStatus() {
	const status = await getLoginStatus();
	await setHeader(status);

	if (status.isAuthenticated && !status.otp_verified) {
		window.location.hash = '#otp';
	}

	return status;
}