export async function checkLoginStatus() {
    try {
        const response = await fetch('/authentication/status/', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const result = await response.json();
			console.log(result);
            return result.isAuthenticated;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
}