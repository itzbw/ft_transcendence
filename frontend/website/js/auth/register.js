import { loadContent, getCookie } from "../tools/tools.js";
import { applyLanguage } from "../tools/language.js";
import { processLogin } from "./login.js";
import './qrcode.min.js';


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


async function showOtpVerify() {

	await loadContent('static/auth/otp.html', 'main-box', applyLanguage);

	const provisioning = await fetch('/api/authentication/otp/provisioning', {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('access_token')}`
		}
	}).then(response => response.json());

	// QR html elements
	const qrelem = document.getElementById('otp_qr_code');
	const qr = new QRCode({
		msg: provisioning.uri,
		pal: ["#000000", "#f2f4f8"],
	});
	qrelem.innerHTML = '';
	qrelem.appendChild(qr);

	const verify = document.getElementById('otp_verify_btn');
	verify.addEventListener('click', async () => {
		const otp = document.getElementById('otp_input').value;
		const response = await fetch('/api/authentication/otp/verify/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('access_token')}`
			},
			body: JSON.stringify({ otp })
		});
		if (response.ok) {
			window.location.hash = '';
			window.location.reload();
		} else {
			const result = await response.json();
			console.log(result.error);
			document.getElementById('otp_message').setAttribute('data-translate', 'invalidotp');
			applyLanguage();
		}
	});
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
				message.textContent = validationErrors.join(' ');
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
					await processLogin({ username, password });
					showOtpVerify();

					// handle the back button if user don't want 2fa
					window.addEventListener('hashchange', function () {
						window.location.reload()}
					);
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
