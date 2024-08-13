// tools
import { PingServer } from './tools/tools.js';

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
	history.pushState({ page: '' }, '', '');
	// if not authenticated, load the login page
	if (!status.isAuthenticated) {
		setupLogin('init');

	// if authenticated, ping server frequently
	} else {
		PingServer();  // immediate ping after login
		setInterval(PingServer, 60000);  // ping every 60 sec
	}
});
