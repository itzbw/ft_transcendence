import { loadContent } from "../router.js";
import { applyLanguage } from "../language.js";
import { getCookie } from "../csrf_token.js";
import { setupLogin } from "./login.js"; 


async function doRegister() {
	try {
		await loadContent('static/auth/register.html', 'main-box', applyLanguage);
		setupLogin();
		console.log("registration page loaded");



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

