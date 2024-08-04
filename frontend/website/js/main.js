import { loadContent } from './router.js';

// Translation
import { applyLanguage} from './language.js';

// authentification
import { checkLoginStatus } from './auth/status.js';
import { setupLogin } from './auth/login.js';
import { setupLogout } from './auth/logout.js';

// User profile
import { setupProfile, showUserProfile } from './users/user_profile.js';

document.addEventListener('DOMContentLoaded', async function() {

	const isLoggedIn = await checkLoginStatus();
	
	if (isLoggedIn.isAuthenticated) {
		await loadContent('static/header/header_full.html', 'header', applyLanguage)
		setupLogout();
		setupProfile(isLoggedIn.username);
	} else {
		await loadContent('static/header/header_mini.html', 'header', applyLanguage)
		await setupLogin("init");
	}



	// FOR TESTS ONLY  ** TO_REMOVE **
	// create a button to see another account's profile
	const test = document.getElementById('testButton');
	test.addEventListener('click', function(){
		showUserProfile("toto");		// Change username HERE
	});
});
