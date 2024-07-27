import { getCookie } from "../csrf_token.js";
import { applyLanguage } from "../language.js";
import { loadContent } from "../router.js";


async function doProfile() {

	const csrftoken = getCookie('csrftoken');

	try {
		await loadContent('static/users/user_profile.html', 'main-box', applyLanguage);
		
		const csrftoken = getCookie('csrftoken');
		const profileUsername = document.getElementById('profileUsername');
		const profileMemberSince = document.getElementById('profileMemberSince');
		const profileAvatar = document.getElementById('profileAvatar');
		// add other infos

		// NEED TO INCOPORATE OVERALL STATS

		// Need the logic to get the profile of the wanted choice
		try {
			
			const response = await fetch('/users/user_profile/', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrftoken,
				}
			});

			if (response.ok) {
				// Fill uername and creation date
				const data = await response.json();
				profileUsername.textContent = data.username;
				profileMemberSince.textContent = data.datecreated;
	
				// Set the avatar image
				const avatarImg = document.createElement('img');
				avatarImg.src = data.avatar;
				avatarImg.alt = "User's Avatar";
				avatarImg.classList.add('avatar');

				// Clear previous avatar if any and append new one
				profileAvatar.innerHTML = '';
				profileAvatar.appendChild(avatarImg);
			} else {
				console.log('Failed to load profile data:', response.statusText);
			}

		} catch (error) {
					console.log('An error occurred during fetch:', error);
		}


	} catch (error) {
		console.error('Error loading profile page:', error);
		// document.getElementById('main-box').textContent = "Profile page was not loaded correctly"
	}
}


// function editUsername()
// function editEmail()
// function changePassword()
// function changeAvatar()
// + method addEventListener for all





export function setupProfile(){
	const profileButton = document.getElementById('profileButton');
	if (profileButton) {
		profileButton.addEventListener('click', doProfile);
	} else {
		console.log('no profile button found');
	}
}