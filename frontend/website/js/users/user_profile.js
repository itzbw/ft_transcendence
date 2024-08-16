import { getCookie } from "../csrf_token.js";
import { applyLanguage } from "../language.js";
import { loadContent } from "../router.js";
import { checkLoginStatus } from "../auth/status.js";
import { setupChangeAvatar, showAvatar } from "./handle_avatar.js";

async function isProfileOwner(profileUsername) {
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
    deleteAccountButton.className = 'm-2 btn btn-danger';
    deleteAccountButton.textContent = 'Delete Account';

    const buttonContainer = document.getElementById("profileDeleteContainer"); // Adjusted container
    buttonContainer.appendChild(deleteAccountButton);

    const enable2FAButton = document.getElementById('enable2FAButton');
    if (enable2FAButton) {
        enable2FAButton.addEventListener('click', enable2FA);
    }

}


function setInformations(data, isProfileOwner) {
    const profileUsername = document.getElementById('profileUsername');
    profileUsername.textContent = data.username;

    const profileMemberSince = document.getElementById('profileMemberSince');
    profileMemberSince.textContent = data.dateCreated;

    if (isProfileOwner) {
        const profileEmail = document.getElementById('profileEmail');
        profileEmail.textContent = data.email;

        // Enable the 2FA section for the profile owner
        const profile2FAContainer = document.getElementById('profile2FAContainer');
        profile2FAContainer.style.display = 'block';
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
    } catch (error) {
        console.error('Failed to update username:', error);
        alert('Failed to update username. See console for more details.');
    }
}

function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

async function updateEmail(username, newEmail) {
    if (!isValidEmail(newEmail)) {
        alert('Invalid email format. Please enter a valid email address.');
        return;
    }

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
        } else {
            const errorData = await response.json();
            console.error('Failed to update email:', errorData);
            alert('Failed to update email. Please try again.');
        }
    } catch (error) {
        console.error('Failed to update email:', error);
        alert('Failed to update email. See console for more details.');
    }
}

async function addFriend(username) {
    const csrftoken = getCookie('csrftoken');
    const friendUsername = document.getElementById('friendUsernameInput').value;
    if (!friendUsername) {
        alert('Please enter a username.');
        return;
    }

    try {
        const response = await fetch('/users/add_friend/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrftoken
            },
            body: `friend_username=${encodeURIComponent(friendUsername)}`
        });

        if (response.ok) {
            alert('Friend added successfully.');
            displayFriends(username);
        } else {
            const errorData = await response.json();
            console.error('Failed to add friend:', errorData);
            alert('Failed to add friend. Please try again.');
        }
    } catch (error) {
        console.error('Failed to add friend:', error);
        alert('Failed to add friend. See console for more details.');
    }
}

async function displayFriends(username) {
    const csrftoken = getCookie('csrftoken');
    try {
        const response = await fetch(`/users/${encodeURIComponent(username)}/friends/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            }
        });

        if (response.ok) {
            const friends = await response.json();
            const friendsListContainer = document.getElementById('friendsListContainer');
            friendsListContainer.innerHTML = '';

            friends.forEach(friend => {
                const friendElement = document.createElement('div');
                friendElement.className = 'friend';
                friendElement.textContent = `${friend.username} (${friend.email})`;
                friendsListContainer.appendChild(friendElement);
            });
        } else {
            console.error('Failed to load friends list:', response.statusText);
        }
    } catch (error) {
        console.error('An error occurred during fetch:', error);
    }
}

async function enable2FA() {
    console.log("Enable 2FA button clicked");
    const csrftoken = getCookie('csrftoken');

    try {
        const response = await fetch('/authentication/generate-qrcode/', {
            method: 'GET',
            headers: {
                'X-CSRFToken': csrftoken,
            },
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);

            // Display the QR code in the qrcodeContainer
            const qrcodeContainer = document.getElementById('qrcodeContainer');
            qrcodeContainer.innerHTML = '';  // Clear previous content
            const qrImage = document.createElement('img');
            qrImage.src = 'data:image/png;base64,' + result.qrcode;
            qrImage.alt = 'QR Code for 2FA';
            qrcodeContainer.appendChild(qrImage);
        } else {
            console.error('Failed to generate 2FA QR code:', response.statusText);
        }
    } catch (error) {
        console.error('2FA setup error:', error);
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
                    setFriendButton(profileUsername);
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

// Will listen click on the profile button
export function setupProfile(username) {
    const profileButton = document.getElementById('profileButton');
    if (profileButton) {
        profileButton.addEventListener('click', () => showUserProfile(username));
    } else {
        console.log('no profile button found');
    }
}



function setFriendButton(username) {
    const friendContainer = document.getElementById('friend-container');
    const viewFriendsButton = document.createElement('button');
    viewFriendsButton.id = 'viewFriendsButton';
    viewFriendsButton.className = 'btn btn-primary';
    viewFriendsButton.textContent = 'View Friends';
    friendContainer.appendChild(viewFriendsButton);

    viewFriendsButton.addEventListener('click', function() {
        displayFriends(username);
    });

    const addFriendContainer = document.createElement('div');
    addFriendContainer.className = 'add-friend-container mt-3';
    friendContainer.appendChild(addFriendContainer);

    const friendUsernameInput = document.createElement('input');
    friendUsernameInput.type = 'text';
    friendUsernameInput.id = 'friendUsernameInput';
    friendUsernameInput.className = 'form-control';
    friendUsernameInput.placeholder = 'Enter username to add as friend';
    addFriendContainer.appendChild(friendUsernameInput);

    const addFriendButton = document.createElement('button');
    addFriendButton.id = 'addFriendButton';
    addFriendButton.className = 'btn btn-primary mt-2';
    addFriendButton.textContent = 'Add Friend';
    addFriendContainer.appendChild(addFriendButton);

    addFriendButton.addEventListener('click', function() {
        addFriend(username);
    });
}

function SetUserProfileEvents(username) {
    setupChangeAvatar(username);

    const modifyUsernameBtn = document.getElementById('modifyProfileUsername');
    const modifyEmailBtn = document.getElementById('modifyProfileEmail');
    const deleteAccountBtn = document.getElementById('deleteAccountButton');
    const addFriendBtn = document.getElementById('addFriendButton');

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

    addFriendBtn.addEventListener('click', function() {
        addFriend(username);
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
        const response = await fetch(`/users/${encodeURIComponent(username)}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            }
        });
        if (response.ok) {
            alert('Account deleted successfully.');
            window.location.href = '/';
        } else {
            const data = await response.json();
            alert('Failed to delete account: ' + data.error);
        }
    } catch (error) {
        console.error('Failed to delete account:', error);
        alert('Failed to delete account. See console for more details.');
    }
}
