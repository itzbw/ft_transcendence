// tools
import { PingServer } from './tools/tools.js';

// router
import { router } from './tools/router.js'

// header
import { setHeader } from './header/header.js';

// authentification
import { checkLoginStatus } from './auth/status.js';


// MAIN FUNCTION
document.addEventListener('DOMContentLoaded', async function() {
	
	// check if user is authenticated
	const status = await checkLoginStatus();

	// load the header
	await setHeader(status);

	// launch the routing
	router(status.isAuthenticated);
	
	// if authenticated, ping server frequently
	if (status.isAuthenticated) {
		PingServer();  // immediate ping after login
		setInterval(PingServer, 60000);  // ping every 60 sec
	}
});

