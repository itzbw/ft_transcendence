import { loadContent } from "../router.js";
import { applyLanguage } from "../language.js";


function showPreview(sourceFile){
	const preview = document.createElement('img')

	preview.src = sourceFile;
	preview.alt = "User's Avatar";
	preview.classList.add('avatar');
	preview.id = 'profileAvatarImgPreview';

	const previewContainer = document.getElementById('changeAvatarPreview');
	previewContainer.innerHTML = '';
	previewContainer.appendChild(preview);
}


export async function changeAvatar(username){
	await loadContent('static/users/change_avatar.html', 'emptyModal', applyLanguage);
	const modal = document.getElementById('profileAvatarModal');
	modal.click();
	console.log("your asked to change your avatar,", username);

	const actualAvatar = document.getElementById('profileAvatarImg');

	showPreview(actualAvatar.src);
			
	const uploadButton = document.getElementById('changeAvatarUploadButton');
	uploadButton.addEventListener('click', function() {
		document.getElementById('fileInput').click();
	});
}

