import { loadContent, getCookie } from "../tools/tools.js";
import { applyLanguage } from "../tools/language.js";


function setRegisterButtonEvent() {
	const button = document.getElementById("registerButton");
	if (button) {
		button.addEventListener('click',function(){
			window.location.href = '#register';
		});
	}
}


export async function processLogin({username, password, otp}) {
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


export async function login() {
	try {
		await loadContent('static/auth/login.html', 'main-box', applyLanguage);
		const form = document.getElementById('login-form');
		const messageElem = document.getElementById('login-message');
		setRegisterButtonEvent();
		if (form) {
			form.addEventListener('submit', async (event) => {
				console.log("Form submitted");
				event.preventDefault();
				
				const username = document.getElementById('username').value;
				const password = document.getElementById('password').value;
				const otp = document.getElementById('otp').value;
				
				try {
					const result = await processLogin({ username, password, otp });

					if (result.error) {
						messageElem.textContent = result.error;
					} else {
						messageElem.textContent = result.message;

						// sets has and reload page
						window.location.href='#home';
						location.reload();
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

