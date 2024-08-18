import { loadContent } from "../tools/tools.js";
import { applyLanguage } from "../tools/language.js";
import { vsHumanGame } from "./game_vs_human.js";
import { getPlayerName } from "./game_utils.js";

export async function getChallenger() {
	
	try {
		await loadContent('static/game/get_challengers.html', 'main-box', applyLanguage);
		
		const playerName = await getPlayerName();
		const submitButton = document.getElementById('submitChallenger');
		const inputField = document.getElementById('challengerInput');
		
		if (submitButton && inputField) {
			submitButton.addEventListener('click', () => {
				const challengerName = inputField.value.trim();
				if (challengerName) {
					if (challengerName == playerName || challengerName === 'Marvin' || challengerName === 'marvin') {
						const message = document.getElementById('challengerMessage');
						message.setAttribute('data-translate', 'invalidusername');
						applyLanguage();
					} else {
						vsHumanGame(challengerName);
					}
				} else {
					alert('please enter a name for the challenger.');
				}
			});
		} else {
			console.error('Missing HTML elements.');
		}
	} catch(error) {
		console.log('Error loading content: ', error);
	}
}