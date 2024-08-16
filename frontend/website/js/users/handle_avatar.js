import { loadContent, getCookie, getAccessToken } from "../tools/tools.js";
import { applyLanguage } from "../tools/language.js";
import { showUserProfile } from "./user_profile.js";


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


async function changeAvatar(username){

	// load modal box and open it with a click
	await loadContent('static/users/change_avatar.html', 'emptyModal', applyLanguage);
	const modal = document.getElementById('profileAvatarModal');
	if (modal) {
		modal.click();
	}
	

	// load the confirm button and set it as disabled
	const confirmButton = document.getElementById('changeAvatarConfirmButton');
	if (confirmButton){
		confirmButton.disabled = true;
	}
	
	// Display a preview of the actual avatar
	const actualAvatar = document.getElementById('profileAvatarImg');
	if (actualAvatar) {
		showAvatar(actualAvatar.src, "changeAvatarPreview");
	}

	// if the Upload button is pressed, click on the fileInput to open explorer box
	const uploadButton = document.getElementById('changeAvatarUploadButton');
	const fileInput = document.getElementById('changeAvatarFileInput');
	let selectedFile = null;

	if (uploadButton && fileInput){
		uploadButton.addEventListener('click', function() {
			fileInput.click();
		});

		// Check if a file was uploaded
		fileInput.addEventListener('change', function() {
			const confirmButton = document.getElementById('changeAvatarConfirmButton');

			if (confirmButton) {
				// a file was detected 
				if (fileInput.files.length > 0) {
					confirmButton.disabled = false; // Enable the button if it's disabled

					selectedFile = fileInput.files[0];
					const reader = new FileReader();

					// triggered when "reader.readAsDataURL(file);" has been read
					reader.onload = function(e) {
						if (e.target.result) {
							showAvatar(e.target.result, "changeAvatarPreview"); // Set the preview image source
						}
					};
					reader.readAsDataURL(selectedFile);
				}
			}
		});
	} else {
		console.error("Upload button or file input not found:", error);
	}

	// Handle the confirm button click
	if (confirmButton) {
		confirmButton.addEventListener('click', async function(){
			if (selectedFile) {
				const formData = new FormData();
				formData.append('avatar', selectedFile);
				
				try {
					const response = await fetch(`/api/users/upload_avatar/${username}/`, {
						method: 'POST',
						body: formData,
						headers: {
							'X-CSRFToken': getCookie('csrftoken'),
							'Authorization': `Bearer ${getAccessToken()}`,
						}
					});
					
					if (response.ok) {
						console.log('Avatar uploaded successfully!');
						showUserProfile(username);
					} else {
						console.error('Failed to upload avatar');
					}
				} catch (error) {
					console.error('Error:', error);
				}
			}
		});
	}
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
