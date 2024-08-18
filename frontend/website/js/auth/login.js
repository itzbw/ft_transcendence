import { loadContent, getCookie } from "../tools/tools.js";
import { applyLanguage } from "../tools/language.js";
import { setupRegister } from "./register.js";
import { applyRoute, router } from "../tools/router.js";
import { checkLoginStatus } from "./status.js";


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
				const otp = document.getElementById('otp').value;

				try {
					const result = await login({ username, password, otp });

					if (result.error) {
						messageElem.innerHTML = `<span style="color:red;">${result.error}</span>`;
					} else {
						messageElem.textContent = result.message;
						location.hash = '';
						await checkLoginStatus();
						await applyRoute();
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

export async function login({ username, password, otp }) {
	const response = await fetch('/api/authentication/login/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': getCookie('csrftoken'),
		},
		body: JSON.stringify({ username, password, otp }),
	});

	const result = await response.json();
	if (response.ok) {
		// Store JWT tokens in localStorage
		localStorage.setItem('access_token', result.access);
		localStorage.setItem('refresh_token', result.refresh);
	}

	return result
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
