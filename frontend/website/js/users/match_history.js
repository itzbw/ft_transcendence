import { loadContent } from "../tools/tools.js";
import { applyLanguage } from "../tools/language.js";


// Display the "Match History" button
async function showMatchHistoryButton(matchHistoryBox) {
	// Button creation
	const button = document.createElement('button');
	button.classList.add('btn', 'btn-light');
	button.setAttribute('data-translate', 'matchhistory');

	// Insert the button into the html
	matchHistoryBox.innerHTML = "";
	matchHistoryBox.appendChild(button);

	// Listen for the click
	return button;
}


async function handleMatchHistory(data) {

	// Load the template 
	await loadContent('static/users/match_history.html', 'emptyModal');

	const modal = document.getElementById('matchHistoryModal');
	if (modal){
		modal.click();  
	}
	const matchHistoryTable = document.getElementById('matchHistoryTable');

	//delete all previous rows
	for(var i = matchHistoryTable.rows.length - 1; i > -1; i--)
	{
			matchHistoryTable.deleteRow(i);
	}
	
	// user never played
	if (data.length === 0) {
		const row = matchHistoryTable.insertRow();
		const cell = row.insertCell(0);
		cell.colSpan = 5;
		cell.classList.add('text-center');
		cell.setAttribute('data-translate', 'nomatchplayed');
	} else {
		data.forEach((item) => {
			//Creating row and cells
			var row = matchHistoryTable.insertRow();
			var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(1);
			var cell3 = row.insertCell(2);
			var cell4 = row.insertCell(3);
			var cell5 = row.insertCell(4);

			//Add players name + trophy
			if (item.player1_score > item.player2_score)
			{
				cell1.innerHTML = ' ' + item.player1_name;
				cell1.className = "bi bi-trophy"
				cell5.innerHTML = item.player2_name;
			}
			else
			{
				cell1.innerHTML = item.player1_name;
				cell5.innerHTML = ' ' + item.player2_name;
				cell5.className = "bi bi-trophy"
			}

			//Add score and separator
			cell2.innerHTML = item.player1_score;
			cell3.innerHTML = ' - ';
			cell4.innerHTML = item.player2_score;
		})
	}

	applyLanguage();
}


export async function matchHistory(data) {

	// Create the button
	const matchHistoryBox = document.getElementById('profileMatchHistory');
	const matchHistoryButton = await showMatchHistoryButton(matchHistoryBox);

	// listen for event on button
	matchHistoryButton.addEventListener('click', () => handleMatchHistory(data));
}