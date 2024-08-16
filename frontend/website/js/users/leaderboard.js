import { loadContent, getCookie, getAccessToken } from '../tools/tools.js';
import { applyLanguage } from '../tools/language.js';
import { showUserProfile } from './user_profile.js';

async function getRawLeaderboardData() {
	const response = await fetch('/api/users/leaderboard/', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': getCookie('csrftoken'),
			'Authorization': `Bearer ${getAccessToken()}`,
		}
	});

	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}

	const data = await response.json();
	return data;
}


function avatarCell(avatar, username) {
	const element = document.createElement('td');
	const avatarImg = document.createElement('img');
	avatarImg.src = avatar;
	avatarImg.alt = `${username}'s avatar`;
	avatarImg.style.width = '50px';
	avatarImg.style.height = '50px';
	avatarImg.style.borderRadius = '50%';
	element.appendChild(avatarImg);
	element.classList.add("text-center");
	return element;
}


// format for each username to be clickable
function usernameCell(username) {
	const element = document.createElement('td');
	element.textContent = username;
	element.classList.add("text-center");

	element.addEventListener('click', async function() {
		// set the history state
		history.pushState({ page: 'profile'}, '', `#profile/${username}`);
		showUserProfile(username);
	});
	return element;
}


function makeLeaderboardRow(user) {
	const row = document.createElement('tr');
	
	row.appendChild(avatarCell(user.avatar, user.username));
	row.appendChild(usernameCell(user.username));

	const wonCell = document.createElement('td');
	wonCell.textContent = user.totalWon;
	wonCell.classList.add("text-center");
	
	const lostCell = document.createElement('td');
	lostCell.textContent = user.totalLost;
	lostCell.classList.add("text-center");
	
	const playedCell = document.createElement('td');
	playedCell.textContent = user.totalPlayed;
	playedCell.classList.add("text-center");

	row.appendChild(wonCell);
	row.appendChild(lostCell);
	row.appendChild(playedCell);
	
	return(row);
}

async function fillLeaderboard(data) {
	const tableBody = document.getElementById('leaderboard-table');
	tableBody.innerHTML = ''; // Nettoie le tableau avant de le remplir

	data.forEach(user => {
		tableBody.appendChild(makeLeaderboardRow(user));
	});
}

export async function leaderboard() {

	await loadContent('/static/leaderboard.html', 'main-box', applyLanguage);
	try {
		const data = await getRawLeaderboardData();
		if (data) {
			fillLeaderboard(data);
		}
	} catch (error) {
		console.error('Error fetching leaderboard data:', error);
	}
}