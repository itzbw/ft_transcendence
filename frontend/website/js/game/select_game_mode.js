import { loadContent } from "../tools/tools.js";
import { applyLanguage } from "../tools/language.js";

export async function setGameModeSelection() {

	// load the template
	await loadContent('static/game/select_game_mode.html', 'main-box', applyLanguage);
}

	function loadGame(mode) {
	const mainWindow = document.getElementById('main-window');
	var script = document.createElement('script');
	if (mode === 'vsBot') {
		if (typeof window.vsBotanimate === 'function') {
		window.setupVsBot();
		} else {
		console.error('setupVsBot is not a function');
		}
	}
	else if (mode === 'vsHuman') {
		if (typeof window.vsBotanimate === 'function') {
		window.setupVsHuman();
		} else {
		console.error('setupVsHuman is not a function');
		}
	}
	else if (mode === 'tournament') {
		mainWindow.innerHTML = '<p>Loading Tournament Game...</p>';
		console.log("tournament game loaded");
	}
	}