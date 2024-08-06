import { applyLanguage } from '../language.js';
import { getCookie, loadContent, setAttribute } from '../tools.js'
import { isProfileOwner } from './user_profile.js';

// check if the user is already in friends list
function isAlreadyFriend(username) {
	return (true);
}

async function handleAddRemoveEvents(event, username) {
	const button = document.getElementById(event + 'FriendButton');
	button.addEventListener('click', async function() {
		try {
			const data = { username };
			const response = await fetch('/api/users/' + event + '_friend/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': getCookie('csrftoken')
				},
				body: JSON.stringify(data)
			});
			if (response.ok) {
				setFriendsBox(username);
			}
		} catch (error) {
			console.error('Failed to' + event + username + ':' + error);
		}
	});
}

// OK
// set the RemoveFriendsButton
function showRemoveFriendButton(friendsBox) {
	console.log("entering showRemoveFriendButton");
	const button = document.createElement('button');
	button.id = "removeFriendButton";
	button.className = "btn btn-outline-danger";
	friendsBox.appendChild(button);
	setAttribute(button.id, "data-translate", "removefriend");
	applyLanguage();
}

// OK
// set the AddFriendsButton
function showAddFriendButton(friendsBox) {
	console.log("entering addRemoveFriendButton");
	const button = document.createElement('button');
	button.id = "addFriendButton";
	button.className = "btn btn-success";
	friendsBox.appendChild(button);
	setAttribute(button.id, "data-translate", "addfriend");
	applyLanguage();
}


// Load friends.html & click the modal
async function showFriendsList(friendsBox) {
	console.log("entering showFriendsList");
	await loadContent('static/users/friends.html', 'friendsContainer', applyLanguage);

	//Fully Fill the content


	//Open the modal
	const modal = document.getElementById('profileAvatarModal');
	if (modal) {
		modal.click();
	}
}


function setFriendsList() {
	console.log("entering setFriendsList");
	const friendsLit = document.getElementById('profileFriendsList');
	if (friendsLit){
		friendsLit.addEventListener('click', () => showFriendsList());
	} else {
		console.log('no friendsLit button found');
	}
}

// OK
export async function setFriendsBox(username){
	
	// get the container here to avoid copy/paste
	const friendsBox = document.getElementById("profileFriendsContainer");
	
	if (!friendsBox)
		console.log("missing container 'profileFriendsContainer'");

	console.log("checking username", username);
	// User own the profile page
	if (await isProfileOwner(username) == true) {
		setFriendsList(friendsBox);
	} else {

		// already in friendsList
		if (isAlreadyFriend(username)) {
			showAddFriendButton(friendsBox, username);
			handleAddRemoveEvents('add', username);

		// not a friend
		} else {
			showRemoveFriendButton(friendsBox, username);
			handleAddRemoveEvents('remove', username);
		}
	}
}
