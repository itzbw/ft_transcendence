import { loadContent } from "../router.js";
import { applyLanguage } from "../language.js";
import { getCookie } from "../csrf_token.js";
import { setupLogin } from "./login.js"; 

// Check if fields are correctly filled
function validateForm(username, email, password) {
    let errors = [];

    // username min size / max size
    if (username.length < 3 || username.length > 30) {
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

// Function to generate QR code for 2FA
async function generateQRCode() {
    try {
        const response = await fetch('/authentication/generate-2fa-qrcode/', {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.qr_code_url;
        } else {
            throw new Error('Failed to generate QR code.');
        }
    } catch (error) {
        console.error('Error generating QR code:', error);
        return null;
    }
}

async function doRegister() {
    try {
        await loadContent('static/auth/register.html', 'main-box', applyLanguage);
        setupLogin();
        console.log("Registration page loaded");

        // Adding "Enable 2FA" checkbox and QR code container directly in the JS
        const form = document.querySelector('form');
        const enable2FAHTML = `
            <label>
                <input type="checkbox" id="enable2FA" />
                Enable Two-Factor Authentication
            </label>
            <div id="qrCodeContainer" style="display:none; margin-top: 10px;">
                <p>Scan the QR code with your authenticator app:</p>
                <img id="qrCode" src="" alt="QR Code for 2FA" />
            </div>
        `;
        form.insertAdjacentHTML('beforeend', enable2FAHTML);

        const message = document.getElementById('registermessage');
        const submitButton = document.getElementById('registerSubmitButton');
        const enable2FACheckbox = document.getElementById('enable2FA');
        const qrCodeContainer = document.getElementById('qrCodeContainer');
        const qrCodeImage = document.getElementById('qrCode');

        // Handle 2FA checkbox change
        enable2FACheckbox.addEventListener('change', async () => {
            if (enable2FACheckbox.checked) {
                const qrCodeUrl = await generateQRCode();
                if (qrCodeUrl) {
                    qrCodeImage.src = qrCodeUrl;
                    qrCodeContainer.style.display = 'block';
                } else {
                    message.textContent = 'Failed to generate QR code for 2FA.';
                    enable2FACheckbox.checked = false;
                }
            } else {
                qrCodeContainer.style.display = 'none';
                qrCodeImage.src = '';
            }
        });

        // If form is submitted
        submitButton.addEventListener('click', async () => {
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const enable2FA = enable2FACheckbox.checked;

            // Check if form entries are correct
            const validationErrors = validateForm(username, email, password);
            if (validationErrors.length > 0) {
                message.textContent = validationErrors.join(' ');
                return;
            }

            // Create object for the request
            const data = { username, email, password, enable2FA };

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
                    window.location.href = '/';
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

export function setupRegister() {
    const registerButton = document.getElementById('registerButton');
    if (registerButton) {
        registerButton.addEventListener('click', doRegister);
    }
}
