import { applyLanguage } from '../tools/language.js';
import { getCookie, loadContent, setAttribute, getAccessToken} from '../tools/tools.js'
import { isProfileOwner, showUserProfile} from './user_profile.js';

// check if the user is already in friends list
async function isAlreadyFriend(username) {
	try {
		const response = await fetch('/api/users/check_friendship/' + username + '/', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': getCookie('csrftoken'),
				'Authorization': `Bearer ${getAccessToken()}`,
			}
		});

		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const data = await response.json();
		return data.is_friend;
	} catch (error) {
		console.error('An error occurred:', error);
		return false; // in case of error, we suppose that that is not a friend
	}
}


// Handle the events when click on the ADD button or REMOVE button
async function handleAddRemoveEvents(event, username) {
	const button = document.getElementById(event + 'FriendButton');
	button.addEventListener('click', async function() {
		try {
			const data = { username };
			const response = await fetch('/api/users/' + event + '_friend/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': getCookie('csrftoken'),
					'Authorization': `Bearer ${getAccessToken()}`,
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


// display the Add Friend button or the Remove Friend button
function showAddRemoveFriendButton(event, friendsBox) {

	// check if button already exists and remove it
	const nonevent = event == 'add'? 'remove' : 'add';
	const existingButton = document.getElementById( nonevent + 'FriendButton');
    if (existingButton) {
        friendsBox.removeChild(existingButton);
    }

	// create the button and display it
	const button = document.createElement('button');
	button.id = event + "FriendButton";
	if (event == 'add') {
		button.className = "btn btn-success";
	} else {
		button.className = "btn btn-outline-danger";
	}
	friendsBox.appendChild(button);
	setAttribute(button.id, "data-translate", event + "friend");
	applyLanguage();
}


// create a div for a friend and listen for click on it
function addFriendItem(username) {
	let div = document.createElement('div');
	div.textContent = username;

	div.addEventListener('click', async function() {
		window.location.hash = `#profile/${username}`;
	});
	return div;
}


// Get friends list from backend and insert it into the modal
function fillFriendsList(data) {
	const friendsListBody = document.getElementById('friendsListBody');

	if (friendsListBody) {
		friendsListBody.innerHTML = '';

		// if no friends found
		if (data.length === 0) {
			const noFriendsMessage = document.createElement('p');
			noFriendsMessage.textContent = 'No friends found.';
			friendsListBody.appendChild(noFriendsMessage);
		
		// if friends found, show them
		} else {
			const ul = document.createElement('ul');
			ul.classList.add('list-group'); // class for design

			data.forEach(friend => {
				const li = document.createElement('li');
				li.classList.add('list-group-item'); // class for design
				li.append(addFriendItem(friend.username));
				ul.appendChild(li);
			});

			friendsListBody.appendChild(ul);
		}
	} else {
		console.error('Element with id "friendsListBody" not found.');
	}
}


// Handle the click on the Friends button
async function handleFriendsList(){
	await loadContent('static/users/friends.html', 'emptyModal', applyLanguage);
	const modal = document.getElementById('friendsListModal');
	if (modal){
		modal.click();
	}

	try {
		const response = await fetch("/api/users/get_friends_list/", {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': getCookie('csrftoken'),
				'Authorization': `Bearer ${getAccessToken()}`,
			}
		});

		if (response.ok) {
			const data = await response.json();
			fillFriendsList(data);
		} else {
			console.log('invalid response for friends list:', response.statusText);
		}
	} catch (error) {
		console.log('An error while trying to get friends list:', error);
	} 
}


// Display the "Friends" button
async function showFriendsListButton(friendsBox) {
	// Button creation
	const button = document.createElement('button');
	button.classList.add('btn', 'btn-light');
	button.setAttribute('data-translate', 'friendslist');

	// Insert the button into the html
	friendsBox.innerHTML = "";
	friendsBox.appendChild(button);
	applyLanguage();

	// Listen for the click
	button.addEventListener('click', handleFriendsList);
}


export async function setFriendsBox(username){
	
	// get the container here to avoid copy/paste
	const friendsBox = document.getElementById("profileFriendsContainer");
	
	if (!friendsBox) {
		console.log("missing container 'profileFriendsContainer'");
	} else {
		try {
			// User own the profile page
			if (await isProfileOwner(username) == true) {
				showFriendsListButton(friendsBox);
			} else {
				let event;
				if (await isAlreadyFriend(username) == true) {
					event = 'remove';
				} else {
					event = 'add';
				}
				showAddRemoveFriendButton(event, friendsBox);
				handleAddRemoveEvents(event, username);
			}
		} catch (error) {
			console.error("An error occurred:", error);
			// Optionally display a user-friendly message or take other actions
			friendsBox.innerHTML = "<p>Something went wrong. Please try again later.</p>";
		}
	}
}
