import { loadContent, getCookie, getAccessToken } from "../tools/tools.js";
import { applyLanguage } from "../tools/language.js";
import { checkLoginStatus } from "../auth/status.js";
import { setupChangeAvatar, showAvatar } from "./handle_avatar.js";
import { setFriendsBox } from "./friends.js";
import { showUserStatus } from "./status.js";
import { matchHistory } from "./match_history.js";

export async function isProfileOwner(profileUsername) {
	const data = await checkLoginStatus();
	if (profileUsername == data.username) {
		return true;
	}
	return false;
}

function setModifyButtons() {
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
	
	// create the delete account button
	let deleteAccountButton = document.createElement('button');
	deleteAccountButton.id = 'deleteAccountButton';
	deleteAccountButton.className = 'm-2 btn btn-sm btn-outline-danger';
	deleteAccountButton.setAttribute('data-translate', 'deleteaccount');

	const buttonContainer = document.getElementById("profileDeleteContainer"); // Adjusted container
	buttonContainer.appendChild(deleteAccountButton);
	applyLanguage();
}

function setInformations(data, isProfileOwner) {
	const profileUsername = document.getElementById('profileUsername');
	profileUsername.textContent = data.username;

	const profileMemberSince = document.getElementById('profileMemberSince');
	profileMemberSince.textContent = data.dateCreated;

	// Must be shown only on our own profile
	if (isProfileOwner) {
		const profileEmail = document.getElementById('profileEmail');
		profileEmail.textContent = data.email;
	}
}

function setOverallStats(data) {
	const totalPlayed = document.getElementById('profileTotalPlayed');
	totalPlayed.textContent = data.totalPlayed;

	const totalWon = document.getElementById('profileTotalWon');
	totalWon.textContent = data.totalWon;

	const totalLost = document.getElementById('profileTotalLost');
	totalLost.textContent = data.totalLost;

	const winRate = document.getElementById('profileWinRate');
	if ((data.totalWon + data.totalLost) == 0) {
		winRate.textContent = '0%';
	} else {
		winRate.textContent = ((data.totalWon / (data.totalWon + data.totalLost)) * 100).toFixed(2) + '%';
	}

	if (data.totalPlayed == 0)
	{
		const div_w_l = document.getElementById('winRateParent');
		div_w_l.setAttribute('data-translate', 'nomatchplayed');
	}
	else
	{
		const canvas = document.getElementById('my_pie_charts');
		const ctx = canvas.getContext('2d');

		const data_w_l = [
			{ label: 'Win', value: data.totalWon, color: '#808291' },
			{ label: 'Lost', value: data.totalLost, color: '#e74c3c' }
		]; //Data for the pie charts

		const totalValue = data_w_l.reduce((sum, item) => sum + item.value, 0);
		let startAngle = 0;
		data_w_l.forEach((item) => {
			if (item.value != 0)
			{
				const sliceAngle = (item.value / totalValue) * 2 * Math.PI;
				// Draw slice
				ctx.beginPath(); //start new drawing
				ctx.moveTo(canvas.width / 2, canvas.height / 2); //Set the drawing cursor to the middle
				ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, startAngle, startAngle + sliceAngle); //draw external arc of circle
				ctx.closePath(); //draw last lines
				ctx.fillStyle = item.color; //Set the color of the slice
				ctx.fill(); // color the slice
				//calculate the position of the text in the middle of the slice
				const textX = canvas.width / 2 + (canvas.height / 4) * Math.cos(startAngle + sliceAngle / 2);
				const textY = canvas.height / 2 + (canvas.height / 4) * Math.sin(startAngle + sliceAngle / 2);
				ctx.fillStyle = '#000'; //Set the color of the text
				ctx.font = '16px Orbitron'; //Set the font
				ctx.fillText(item.label, textX, textY); //Write text
				startAngle += sliceAngle; //Set new position  for the next slice
			}
		})
	}
}

async function updateUsername(oldUsername, newUsername) {
	try {
		const response = await fetch(`/api/users/${encodeURIComponent(oldUsername)}/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'X-CSRFToken': getCookie('csrftoken'),
				'Authorization': `Bearer ${getAccessToken()}`,
			},
			body: `username=${encodeURIComponent(newUsername)}`
		});
		if (response.ok) {
			showUserProfile(newUsername);
		}
	} catch (error) {
		console.error('Failed to update username:', error);
		alert('Failed to update username. See console for more details.');
	}
}

async function updateEmail(username, newEmail) {
	try {
		const response = await fetch(`/api/users/${encodeURIComponent(username)}/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'X-CSRFToken': getCookie('csrftoken'),
				'Authorization': `Bearer ${getAccessToken()}`,
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
	const profileUrl = "/api/users/" + profileUsername + "/";

	try {
		// load the template
		await loadContent('static/users/user_profile.html', 'main-box', applyLanguage);

		try {
			const response = await fetch(profileUrl, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': getCookie('csrftoken'),
					'Authorization': `Bearer ${getAccessToken()}`,
				}
			});

			if (response.ok) {
				const data = await response.json();
				showAvatar(data.avatar, 'profileAvatar');
				showUserStatus(data.is_online);
				setOverallStats(data);
				matchHistory(data.games);
				setFriendsBox(profileUsername);
				if (await isProfileOwner(profileUsername) == true) {
					setInformations(data, true);
					setModifyButtons();
					SetUserProfileEvents(profileUsername);
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

function SetUserProfileEvents(username) {
	setupChangeAvatar(username);

	const modifyUsernameBtn = document.getElementById('modifyProfileUsername');
	const modifyEmailBtn = document.getElementById('modifyProfileEmail');
	const deleteAccountBtn = document.getElementById('deleteAccountButton');

	modifyUsernameBtn.addEventListener('click', function() {
		handleInputField('usernameInputField', 'Enter new username', updateUsername);
	});

	modifyEmailBtn.addEventListener('click', function() {
		handleInputField('emailInputField', 'Enter new email', updateEmail);
	});

	deleteAccountBtn.addEventListener('click', function() {
		if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
			deleteAccount(username);
		}
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

async function deleteAccount(username) {
	try {
		const response = await fetch(`/api/users/${encodeURIComponent(username)}/`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': getCookie('csrftoken'),
				'Authorization': `Bearer ${getAccessToken()}`,
			}
		});
		if (response.ok) {
			alert('Account deleted successfully.');
			window.location.href = '/'; // Redirect to home page or login page after account deletion
			localStorage.clear();
		} else {
			const data = await response.json();
			alert('Failed to delete account: ' + data.error);
		}
	} catch (error) {
		console.error('Failed to delete account:', error);
		alert('Failed to delete account. See console for more details.');
	}
}
