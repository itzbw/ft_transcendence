import { loadContent, addTestButton } from './tools.js';  // ** TO_REMOVE ** addTestButton
import { locationHandler } from './router.js';

// header
import { setHeader } from './header/header.js';


// // Translation
// import { applyLanguage} from './language.js';

// authentification
import { checkLoginStatus } from './auth/status.js';
import { setupLogin } from './auth/login.js';




// MAIN FUNCTION
document.addEventListener('DOMContentLoaded', async function() {

	const status = await checkLoginStatus();
	
	await setHeader(status);

	if (!status.isAuthenticated) {
		console.log("no user authenticated");
		setupLogin('init');
	}








	// For tests only ** TO_REMOVE **
	addTestButton();
});




