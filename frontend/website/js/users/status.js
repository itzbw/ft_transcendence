import { applyLanguage } from "../language.js";

export function showUserStatus(status) {
	const icon = document.createElement('i');
	const text = document.createElement('div');
	
	console.log("is online?", status);
	if (status) {
		icon.classList.add('bi', 'bi-circle-fill', 'text-success');
		text.classList.add('text-success', 'text-uppercase');
		text.setAttribute('data-translate', 'online');
	} else {
		icon.classList.add('bi', 'bi-circle-fill', 'text-danger');
		text.classList.add('text-danger', 'text-uppercase');
		text.setAttribute('data-translate', 'offline');
	}
	
	const element = document.getElementById('profileOnlineStatus');
	if (element) {
		element.appendChild(icon);
		element.appendChild(text);
	}
	applyLanguage();
}