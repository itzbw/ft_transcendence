import { bootstrapLogin } from './auth/login.js';


// MAIN FUNCTION
document.addEventListener('DOMContentLoaded', async function () {
	await bootstrapLogin();
});

