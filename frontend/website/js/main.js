import { loadContent } from './router.js';
import { translations, getTranslationForKey, applyLanguage, setLanguage } from './language.js';

document.addEventListener('DOMContentLoaded', async function() {

	const isLoggedIn = await checkLoginStatus();

	const aboutElem = document.getElementById('aboutContainer');
	loadContent('static/about.html', aboutElem, applyLanguage);

	const headerElem = document.getElementById('header');
	if (isLoggedIn) {
		loadContent('static/header/header_full.html', headerElem, applyLanguage)
	} else {
		loadContent('static/header/header_mini.html', headerElem, applyLanguage)
	}
});

// document.addEventListener('DOMContentLoaded', async () => {
//     // Fonction pour vérifier l'état de connexion et afficher/masquer le menu
//     const isLoggedIn = await checkLoginStatus();
    
//     const navbarList = document.getElementById('navbar-list');
// 	const navbarToggler = document.getElementById('navbar-toggler');
//     if (isLoggedIn) {
//         navbarList.style.display = 'flex';
//         navbarToggler.style.display = 'flex';
//     } else {
//         navbarList.style.display = 'none';
//         navbarToggler.style.display = 'none';
//     }
// });

async function checkLoginStatus() {
    try {
        const response = await fetch('/authentication/status/', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const result = await response.json();
			console.log(result);
            return result.isAuthenticated; // Supposons que le backend renvoie { isAuthenticated: true/false }
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
}
