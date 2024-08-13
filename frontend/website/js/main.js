// header
import { setHeader } from './header/header.js';

// authentification
import { checkLoginStatus } from './auth/status.js';
import { setupLogin } from './auth/login.js';


// MAIN FUNCTION
document.addEventListener('DOMContentLoaded', async function() {

	// check if user is authenticated
	const status = await checkLoginStatus();
	
	// load the header
	await setHeader(status);

	// if not authenticated, load the login page
	if (!status.isAuthenticated) {
		console.log("no user authenticated");
		setupLogin('init');
	}
});

