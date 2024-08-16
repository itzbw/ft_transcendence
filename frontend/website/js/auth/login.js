import { loadContent, getCookie } from "../tools/tools.js";
import { applyLanguage } from "../tools/language.js";
import { setupRegister } from "./register.js";
import { setupProfile, showUserProfile } from '../users/user_profile.js';
import { checkLoginStatus } from '../auth/status.js';
import { setupLogout } from "./logout.js";



async function doLogin() {
	try {
		await loadContent('static/auth/login.html', 'main-box', applyLanguage);
		const form = document.getElementById('login-form');
		const messageElem = document.getElementById('login-message');
		setupRegister()
		if (form) {
			form.addEventListener('submit', async (event) => {
				console.log("Form submitted");
				event.preventDefault();

				const username = document.getElementById('username').value;
				const password = document.getElementById('password').value;

				try {
					const response = await fetch('/api/authentication/login/', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'X-CSRFToken': getCookie('csrftoken'),
						},
						body: JSON.stringify({ username, password }),
					});

					const result = await response.json();
					console.log(result);
					if (response.ok) {
						// Store JWT tokens in localStorage
						localStorage.setItem('access_token', result.access);
						localStorage.setItem('refresh_token', result.refresh);

						messageElem.textContent = "Login successful!";

						await bootstrapLogin()
					} else {
						messageElem.textContent = result.error;
					}
				} catch (error) {
					messageElem.textContent = 'An error occurred during fecth';
				}
			});
		}
	} catch (error) {
		console.error('Error setting up login:', error);
	}
}


export function setupLogin(type) {
	// If not defined, no button "login to click", so no doLogin()
	if (type === "init")
		doLogin()
	else {
		const loginButton = document.getElementById('loginButton');
		if (loginButton) {
			loginButton.addEventListener('click', doLogin);
		}
	}
}

export async function bootstrapLogin() {
	const isLoggedIn = await checkLoginStatus();
	console.log({ isLoggedIn })

	if (isLoggedIn.isAuthenticated) {
		await loadContent('static/header/header_full.html', 'header', applyLanguage)
		setupLogout();
		setupProfile(isLoggedIn.username);
		showUserProfile(isLoggedIn.username);
	} else {
		await loadContent('static/header/header_mini.html', 'header', applyLanguage)
		await setupLogin("init");
	}
}