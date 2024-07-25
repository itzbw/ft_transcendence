import { loadContent } from "../router.js";
import { applyLanguage } from "../language.js";
import { getCookie } from "../csrf_token.js";


export async function setupLogin() {

	try {
		await loadContent('static/login.html', 'main-box', applyLanguage);
		const form = document.getElementById('login-form');
				const messageElem = document.getElementById('login-message');
				
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
							messageElem.textContent = 'An error occurred';
						}
					});
				}
	} catch (error) {
		console.error('Error setting up login:', error);
	}
}