import { loadContent } from './router.js';

// Translation
import { applyLanguage} from './language.js';

// authentification
import { checkLoginStatus } from './auth/status.js';
import { setupLogin } from './auth/login.js';
import { setupLogout } from './auth/logout.js';

// User profile
import { setupProfile } from './users/user_profile.js';


document.addEventListener('DOMContentLoaded', async function() {

	loadContent('static/about.html', 'aboutContainer');
	const isLoggedIn = await checkLoginStatus();
	
	if (isLoggedIn.isAuthenticated) {
		await loadContent('static/header/header_full.html', 'header', applyLanguage)
		setupLogout();
		setupProfile(isLoggedIn.username);
	} else {
		await loadContent('static/header/header_mini.html', 'header', applyLanguage)
		await setupLogin("init");
	}
});
