import { loadContent } from "../router.js";
import { applyLanguage } from "../language.js";
import { getCookie } from "../csrf_token.js";
import { setupLogin } from "./login.js"; 

// Check if fields are correctly filled
function validateForm(username, email, password) {
    let errors = [];

    // username min size / max size
    if (username.length < 3 || username.length >30)  {
        errors.push('Username must be between 3 and 30 characters long.');
    }

    // Check email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        errors.push('Please enter a valid email address.');
    }

    // password min size
    if (password.length < 4) {
        errors.push('Password must be at least 4 characters long.');
    }

    return errors;
}


async function doRegister() {
	try {
		await loadContent('static/auth/register.html', 'main-box', applyLanguage);
		setupLogin();
		console.log("registration page loaded");

		const message = document.getElementById('registermessage');
		const submitButton = document.getElementById('registerSubmitButton');


		
		// If form is submited
		submitButton.addEventListener('click', async () => {
			const username = document.getElementById('username').value;
			const email = document.getElementById('email').value;
			const password = document.getElementById('password').value;
			
			// Check if form entries are correct
			const validationErrors = validateForm(username, email, password);
			if (validationErrors.length > 0) {
				message.textContent = validationErrors.join(' ');
				return;
			}

			// Create object for the request
			const data = { username, email, password };

			try {
				const response = await fetch('/authentication/register/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': getCookie('csrftoken')
					},
					body: JSON.stringify(data)
				});

				const result = await response.json();
				if (!response.ok) {
					message.textContent = result.error;
				} else {
					window.location.href='/';
					
					location.reload();
				}
			} catch (error) {
					console.error('Error during registration:', error);
					document.getElementById('registermessage').textContent = 'Error during registration';
			}
		});


	} catch (error) {
		console.error('Error setting up registration:', error);
	}
}


export function setupRegister(){
	const registerButton = document.getElementById('registerButton');
	if (registerButton) {
		registerButton.addEventListener('click', doRegister);
	}
}

