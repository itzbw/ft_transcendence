import { loadContent } from "../router.js";
import { applyLanguage } from "../language.js";


// This function shows a preview of the new avatar and sets up the upload
function showPreview(sourceFile) {
    const preview = document.createElement('img');
    preview.src = sourceFile;
    preview.alt = "User's Avatar";
    preview.classList.add('avatar');
    preview.id = 'profileAvatarImgPreview';

    const previewContainer = document.getElementById('changeAvatarPreview');
    previewContainer.innerHTML = '';
    previewContainer.appendChild(preview);
}

export async function changeAvatar(username) {
    await loadContent('static/users/change_avatar.html', 'emptyModal', applyLanguage);
    const modal = document.getElementById('profileAvatarModal');
    modal.click();
    console.log("you asked to change your avatar,", username);

    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const newAvatarSrc = e.target.result;
            showPreview(newAvatarSrc);
            uploadAvatar(newAvatarSrc, username);  // Function to upload the avatar
        };
        reader.readAsDataURL(file);
    });

    const uploadButton = document.getElementById('changeAvatarUploadButton');
    uploadButton.addEventListener('click', function() {
        fileInput.click();
    });
}

// Function to upload the avatar to the server
async function uploadAvatar(newAvatarSrc, username) {
    try {
        const response = await fetch("/api/avatar/update", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({ username: username, avatar: newAvatarSrc })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Avatar updated successfully:', data);
            refreshUserProfile(username);  // Refresh user profile to show new avatar
        } else {
            console.log('Failed to upload new avatar:', response.statusText);
        }
    } catch (error) {
        console.error('Error uploading new avatar:', error);
    }
}

// Function to refresh user profile
async function refreshUserProfile(username) {
    showUserProfile(username);
}
