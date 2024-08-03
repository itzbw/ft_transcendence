import { loadContent } from "../router.js";
import { applyLanguage } from "../language.js";


// display the choosen image in the given zone
export function showAvatar(sourceFile, targetArea){
	const avatar = document.createElement('img')

	avatar.src = sourceFile;
	avatar.alt = "User's Avatar";
	avatar.classList.add('avatar');
	avatar.id = targetArea + 'Img';

	const avatarContainer = document.getElementById(targetArea);
	avatarContainer.innerHTML = '';
	avatarContainer.appendChild(avatar);
}




export async function changeAvatar(username){

	// load modal box and open it with a click
	await loadContent('static/users/change_avatar.html', 'emptyModal', applyLanguage);
	const modal = document.getElementById('profileAvatarModal');
	modal.click();
	console.log("your asked to change your avatar", username);

	// load the confirm button and set it as disabled
	const confirmButton = document.getElementById('changeAvatarConfirmButton');
	confirmButton.disabled = true;
	
	// Display a preview of the actual avatar
	const actualAvatar = document.getElementById('profileAvatarImg');
	showAvatar(actualAvatar.src, "changeAvatarPreview");

	// if the Upload button is pressed, click on the fileInput to open explorer box
	const uploadButton = document.getElementById('changeAvatarUploadButton');
	const fileInput = document.getElementById('changeAvatarFileInput')
	uploadButton.addEventListener('click', function() {
		fileInput.click();
	});

	// Check if a file was uploaded
	fileInput.addEventListener('change', function() {
		const confirmButton = document.getElementById('changeAvatarConfirmButton');

		// a file was detected 
        if (fileInput.files.length > 0) {
            confirmButton.disabled = false; // Enable the button if it's disabled
		}
	});

}


// load the event for a click on the avatar, allowing to change it
export async function setupChangeAvatar(username) {
	const avatar = document.getElementById('profileAvatar');
	if (avatar){
		avatar.addEventListener('click', () => changeAvatar(username));
	} else {
		console.log('no avatar button found');
	}
}
