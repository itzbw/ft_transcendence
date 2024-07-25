document.addEventListener('DOMContentLoaded', () => {
    // Fonction pour charger un fichier HTML dans une div
    async function loadHTML(url, elementId) {
        const response = await fetch(url);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        initLoginForm();  // Initialiser le formulaire de login après avoir chargé le HTML
    }

    // Charger le formulaire de login dans main-box
    loadHTML('static/login.html', 'main-box');

	// Pour eviter les CSRF errors
	function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Fonction pour initialiser le formulaire de login
    function initLoginForm() {
        const form = document.getElementById('login-form');
        const messageElem = document.getElementById('login-message');

        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                const csrftoken = getCookie('csrftoken');

                try {
                    const response = await fetch('/authentication/login/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrftoken,
                        },
                        body: JSON.stringify({ username, password }),
                    });
                    
                    const result = await response.json();
                    if (response.ok) {
                        messageElem.textContent = result.message;
                        // Rediriger ou afficher le contenu de l'utilisateur connecté
                    } else {
                        messageElem.textContent = result.error;
                    }
                } catch (error) {
                    messageElem.textContent = 'An error occurred';
                }
            });
        }
    }
});