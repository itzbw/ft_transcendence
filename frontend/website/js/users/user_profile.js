import { getCookie } from "../csrf_token.js";
import { applyLanguage } from "../language.js";
import { loadContent } from "../router.js";
import { checkLoginStatus } from "../auth/status.js";
import { changeAvatar } from "./change_avatar.js"

function setInformations(data){
	const profileUsername = document.getElementById('profileUsername');
	profileUsername.textContent = data.username;

	const profileMemberSince = document.getElementById('profileMemberSince');
	profileMemberSince.textContent = data.dateCreated;

	// Must not be HERE but in additionnal
	const profileEmail = document.getElementById('profileEmail');
	profileEmail.textContent = data.email;
}

function setAvatar(data){
	const avatarImg = document.createElement('img');
	avatarImg.src = data.avatar;
	avatarImg.alt = "User's Avatar";
	avatarImg.classList.add('avatar');
	avatarImg.id = 'profileAvatarImg';


	const profileAvatar = document.getElementById('profileAvatar');
	profileAvatar.innerHTML = '';			// Clear previous one
	profileAvatar.appendChild(avatarImg);
}

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

async function showUserProfile(profileUsername) {
	const csrftoken = getCookie('csrftoken');
	const profileUrl = "/users/" + profileUsername + "/";
	
	try {
		const csrftoken = getCookie('csrftoken');
		await loadContent('static/users/user_profile.html', 'main-box', applyLanguage);

		try {
			
			const response = await fetch(profileUrl, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrftoken,
				}
			});

			if (response.ok) {
				const data = await response.json();
				console.log(data);
				setInformations(data);
				setAvatar(data);
				setOverallStats(data);
				SetUserProfileEvents(profileUsername);
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


// Used to call our own profile
export function setupProfile(username){
	const profileButton = document.getElementById('profileButton');
	if (profileButton) {
		profileButton.addEventListener('click', () => showUserProfile(username));
	} else {
		console.log('no profile button found');
	}
}


function SetUserProfileEvents(username){
	const avatar = document.getElementById('profileAvatar');
	if (avatar){
		avatar.addEventListener('click', () => changeAvatar(username));
	} else {
		console.log('no avatar button found');
	}
}