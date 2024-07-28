import { loadContent } from "../router.js";
import { applyLanguage } from "../language.js";

export async function changeAvatar(username){
	await loadContent('static/users/change_avatar.html', 'emptyModal', applyLanguage);
	const modal = document.getElementById('profileAvatarModal');
	modal.click();
	console.log("your asked to change your avatar,", username);
}