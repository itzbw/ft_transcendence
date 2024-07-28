import { loadContent } from "../router.js";
import { applyLanguage } from "../language.js";
import { getCookie } from "../csrf_token.js";
import { setupRegister } from "./register.js";


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
						messageElem.textContent = result.message;
						location.reload();
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


export function setupLogin(type)
{
	// If not defined, no button "login to click", so no doLogin()
	if (type === "init")
		doLogin()
	else
	{
		const loginButton = document.getElementById('loginButton');
		if (loginButton) {
			loginButton.addEventListener('click', doLogin);
		}
	}
}
