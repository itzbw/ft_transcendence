// tools
import { PingServer } from './tools/tools.js';

// router
import { router } from './tools/router.js'

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
		setupLogin('init');
		
	} else {
		// launch the routing
		router();
		
		// if authenticated, ping server frequently
		PingServer();  // immediate ping after login
		setInterval(PingServer, 60000);  // ping every 60 sec
	}
});

