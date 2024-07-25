import { loadContent } from './router.js';

// Translation
import { applyLanguage} from './language.js';

// authentification
import { checkLoginStatus } from './auth/status.js';
import { setupLogin } from './auth/login.js';
import { setupLogout } from './auth/logout.js';


document.addEventListener('DOMContentLoaded', async function() {

	const isLoggedIn = await checkLoginStatus();

	loadContent('static/about.html', 'aboutContainer', applyLanguage);

	if (isLoggedIn) {
		await loadContent('static/header/header_full.html', 'header', applyLanguage)
		setupLogout();
	} else {
		await loadContent('static/header/header_mini.html', 'header', applyLanguage)
		await setupLogin("init");
	}
});
