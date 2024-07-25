import { loadContent } from './router.js';
import { translations, getTranslationForKey, applyLanguage, setLanguage } from './language.js';

document.addEventListener('DOMContentLoaded', function() {
	loadContent('static/about.html', applyLanguage);
    // applyLanguage();
});

document.addEventListener('DOMContentLoaded', async () => {
    // Fonction pour vérifier l'état de connexion et afficher/masquer le menu
    const isLoggedIn = await checkLoginStatus();
    
    const navbarList = document.getElementById('navbar-list');
    if (isLoggedIn) {
        navbarList.style.display = 'flex';
    } else {
        navbarList.style.display = 'none';
    }
});

async function checkLoginStatus() {
    try {
        const response = await fetch('/authentication/status/', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const result = await response.json();
            return result.isAuthenticated; // Supposons que le backend renvoie { isAuthenticated: true/false }
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
}
