import { getCookie } from "../csrf_token.js";
import { applyLanguage } from "../language.js";
import { loadContent } from "../router.js";
import { checkLoginStatus } from "../auth/status.js";
import { setupChangeAvatar, showAvatar } from "./handle_avatar.js"

async function isProfileOwner(profileUsername){
	const data = await checkLoginStatus();
	if (profileUsername == data.username){
		return true;
	}
	return false;
}


function setModifyButtons(){

	// create the username modify button
	let modifyUsernameButton = document.createElement('button');
	modifyUsernameButton.id = 'modifyProfileUsername';
	modifyUsernameButton.className = 'm-2 bi bi-pencil-fill';
	
	const usernameContainer = document.getElementById("profileUsernameContainer");
	usernameContainer.appendChild(modifyUsernameButton);

	// create the email modify button
	let modifyEmailButton = document.createElement('button');
	modifyEmailButton.id = "modifyProfileEmail";
	modifyEmailButton.className = 'm-2 bi bi-pencil-fill';

	const emailContainer = document.getElementById("profileEmailContainer");
	emailContainer.appendChild(modifyEmailButton);
}


function setInformations(data, isProfileOwner){
	const profileUsername = document.getElementById('profileUsername');
	profileUsername.textContent = data.username;

	const profileMemberSince = document.getElementById('profileMemberSince');
	profileMemberSince.textContent = data.dateCreated;

	// Must be shown only on our own profile
	if (isProfileOwner){
		const profileEmail = document.getElementById('profileEmail');
		profileEmail.textContent = data.email;
	}
}


// May need more actions to complete the module
function setOverallStats(data)
{
	const totalPlayed = document.getElementById('profileTotalPlayed');
	totalPlayed.textContent = data.totalPlayed;

	const totalWon = document.getElementById('profileTotalWon');
	totalWon.textContent = data.totalWon;

	const totalLost = document.getElementById('profileTotalLost');
	totalLost.textContent = data.totalLost;

	const winRate = document.getElementById('profileWinRate');
	if ((data.totalWon + data.totalLost) == 0){
		winRate.textContent = '0%';
	} else {
		winRate.textContent = ((data.totalWon / (data.totalWon + data.totalLost)) / 100) + '%';
	}
}


async function updateUsername(oldUsername, newUsername) {
	const csrftoken = getCookie('csrftoken');
	try {
		const response = await fetch(`/users/${encodeURIComponent(oldUsername)}/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'X-CSRFToken': csrftoken
			},
			body: `username=${encodeURIComponent(newUsername)}`
		});
		if (response.ok) {
			showUserProfile(newUsername);
		}
	}catch (error) {
		console.error('Failed to update username:', error);
		alert('Failed to update username. See console for more details.');
	}
}


async function updateEmail(username, newEmail) {
	const csrftoken = getCookie('csrftoken');
	try {
		const response = await fetch(`/users/${encodeURIComponent(username)}/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'X-CSRFToken': csrftoken
			},
			body: `email=${encodeURIComponent(newEmail)}`
		});
		if (response.ok) {
			showUserProfile(username);
		}
	} catch (error) {
		console.error('Failed to update email:', error);
		alert('Failed to update email. See console for more details.');
	}
}


export async function showUserProfile(profileUsername) {
	const profileUrl = "/users/" + profileUsername + "/";

	try {
		const csrftoken = getCookie('csrftoken');
		await loadContent('static/users/user_profile.html', 'main-box', applyLanguage);

		try {
			
			const response = await fetch(profileUrl, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': getCookie('csrftoken'),
				}
			});

			if (response.ok) {
				const data = await response.json();
				showAvatar(data.avatar, 'profileAvatar');
				setOverallStats(data);
				if (await isProfileOwner(profileUsername) == true) {
					setInformations(data, true);
					setModifyButtons();
					SetUserProfileEvents(profileUsername);
					// setDeleteAccountButton(profileUsername);
				} else {
					setInformations(data, false);
				}
			} else {
				console.log('Failed to load profile data:', response.statusText);
			}

		} catch (error) {
					console.log('An error occurred during fetch:', error);
		}

	} catch (error) {
		console.error('Error loading profile page:', error);
	}
}


//Will listen click on the profile button
export function setupProfile(username){
	const profileButton = document.getElementById('profileButton');
	if (profileButton) {
		profileButton.addEventListener('click', () => showUserProfile(username));
	} else {
		console.log('no profile button found');
	}
}


function SetUserProfileEvents(username) {
	setupChangeAvatar(username);

	const modifyUsernameBtn = document.getElementById('modifyProfileUsername');
	const modifyEmailBtn = document.getElementById('modifyProfileEmail');

	modifyUsernameBtn.addEventListener('click', function() {
		handleInputField('usernameInputField', 'Enter new username', updateUsername);
	});

	modifyEmailBtn.addEventListener('click', function() {
		handleInputField('emailInputField', 'Enter new email', updateEmail);
	});

	function handleInputField(fieldId, placeholder, updateFunction) {
		let inputField = document.getElementById(fieldId);
		if (!inputField) {
			inputField = document.createElement('input');
			inputField.id = fieldId;
			inputField.type = fieldId === 'emailInputField' ? 'email' : 'text'; 
			inputField.placeholder = placeholder;
			inputField.style.marginTop = '10px';
			const button = fieldId === 'emailInputField' ? modifyEmailBtn : modifyUsernameBtn;
			button.parentNode.insertBefore(inputField, button.nextSibling);
			inputField.addEventListener('keypress', function(event) {
				if (event.key === 'Enter') {
					updateFunction(username, inputField.value);
					inputField.remove(); 
				}
			});
			inputField.focus();
		} else {
			inputField.focus();
		}
	}
}