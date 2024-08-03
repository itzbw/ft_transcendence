import { getCookie } from "../csrf_token.js";
import { applyLanguage } from "../language.js";
import { loadContent } from "../router.js";
import { checkLoginStatus } from "../auth/status.js";
import { setupChangeAvatar, showAvatar } from "./handle_avatar.js"

function setInformations(data){
	const profileUsername = document.getElementById('profileUsername');
	profileUsername.textContent = data.username;

	const profileMemberSince = document.getElementById('profileMemberSince');
	profileMemberSince.textContent = data.dateCreated;

	// Must not be HERE but in additionnal
	const profileEmail = document.getElementById('profileEmail');
	profileEmail.textContent = data.email;
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
				showAvatar(data.avatar, 'profileAvatar');
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