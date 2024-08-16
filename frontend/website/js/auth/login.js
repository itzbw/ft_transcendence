import { loadContent } from "../router.js";
import { applyLanguage } from "../language.js";
import { getCookie } from "../csrf_token.js";
import { setupRegister } from "./register.js";

async function doLogin() {
    try {
        await loadContent('static/auth/login.html', 'main-box', applyLanguage);
        const form = document.getElementById('login-form');
        const messageElem = document.getElementById('login-message');
        setupRegister();

        if (form) {
            form.addEventListener('submit', async (event) => {
                console.log("Form submitted");
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
                    console.log(result);
                    if (response.ok) {
                        // Store JWT tokens in localStorage
                        localStorage.setItem('access_token', result.access);
                        localStorage.setItem('refresh_token', result.refresh);

                        // Optionally store the username
                        localStorage.setItem('username', result.username);

                        messageElem.textContent = "Login successful!";
                        // Redirect or reload the page
                        location.reload();
                    } else {
                        messageElem.textContent = result.error;
                    }
                } catch (error) {
                    messageElem.textContent = 'An error occurred during the fetch request';
                    console.error('Fetch error:', error);
                }
            });
        }
    } catch (error) {
        console.error('Error setting up login:', error);
    }
}

async function enable2FA() {
    const csrftoken = getCookie('csrftoken');

    try {
        const response = await fetch('/authentication/enable-2fa/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({ enable_2fa: true }),
        });

        const result = await response.json();
        const messageElem = document.getElementById('login-message');
        
        if (response.ok) {
            messageElem.textContent = "2FA enabled successfully!";
            // Additional steps if needed after enabling 2FA
        } else {
            messageElem.textContent = result.error;
        }
    } catch (error) {
        messageElem.textContent = 'An error occurred while enabling 2FA';
        console.error('2FA enable error:', error);
    }
}

export function setupLogin(type) {
    if (type === "init") {
        doLogin();
    } else {
        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            loginButton.addEventListener('click', doLogin);
        }
    }

    const enable2FAButton = document.getElementById('enable2FAButton');
    if (enable2FAButton) {
        enable2FAButton.addEventListener('click', enable2FA);
    }
}
