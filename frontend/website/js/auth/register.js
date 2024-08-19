import { loadContent, getCookie } from "../tools/tools.js";
import { applyLanguage } from "../tools/language.js";


function setLoginButtonEvent() {
	const button = document.getElementById("loginButton");
	if (button) {
		button.addEventListener('click',function(){
			window.location.href = '#login';
		});
	}
}

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


export async function register() {
	try {
		await loadContent('static/auth/register.html', 'main-box', applyLanguage);
		setLoginButtonEvent();

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
				message.textCont
				// Chent = validationErrors.join(' ');
				return;
			}

			// Create object for the request
			const data = { username, email, password };

			try {
				const response = await fetch('/api/authentication/register/', {
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
					window.location.href='#login';
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
