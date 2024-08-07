import { applyLanguage } from '../language.js';
import { getCookie, loadContent, setAttribute } from '../tools.js'
import { isProfileOwner } from './user_profile.js';

// check if the user is already in friends list
async function isAlreadyFriend(username) {
	try {
		const response = await fetch('/api/users/check_friendship/' + username + '/', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': getCookie('csrftoken')
			}
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const data = await response.json();
		console.log(data);
		return data.is_friend;
	} catch (error) {
		console.error('An error occurred:', error);
		return false; // in case of error, we suppose that that is not a friend
	}
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
	friendsBox.innerHtml = "";
	console.log("entering addRemoveFriendButton");
	const button = document.createElement('button');
	button.id = "addFriendButton";
	button.className = "btn btn-success";
	friendsBox.innerHtml(button);
	setAttribute(button.id, "data-translate", "addfriend");
	applyLanguage();
}


// Load friends.html & click the modal
async function showFriendsList(friendsBox) {
	console.log("entering showFriendsList");
	// await loadContent('static/users/friends.html', 'friendsContainer', applyLanguage);

	//Fully Fill the content

	//Open the modal
	// const modal = document.getElementById('profileAvatarModal');
	// if (modal) {
	// 	modal.click();
	// }
}


async function setFriendsList() {
	console.log("entering setFriendsList");
//////  *-------------------------
	try {
		const response = await fetch('/api/users/get_friends_list/', {
			method: 'GET',
		});
		if (response.ok) {
			const result = await response.json();
			console.log("HERE:", result);
		}
	} catch (error) {
		console.error('Failed');
	}
//////  *-------------------------
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
	
	if (!friendsBox) {
		console.log("missing container 'profileFriendsContainer'");
	} else {
		try {
			// User own the profile page
			if (await isProfileOwner(username) == true) {
				// setFriendsList(friendsBox);
			} else {
		
				// already in friendsList
				if (isAlreadyFriend(username)) {
					console.log(username,"is your friend");
					// showRemoveFriendButton(friendsBox, username);
					// handleAddRemoveEvents('remove', username);
		
				// not a friend
				} else {
					console.log(username,"is NOT your friend");
					// showAddFriendButton(friendsBox, username);
					// handleAddRemoveEvents('add', username);
				}
			}

		} catch (error) {
			console.error("An error occurred:", error);
			// Optionally display a user-friendly message or take other actions
			friendsBox.innerHTML = "<p>Something went wrong. Please try again later.</p>";
		}
	}
}
