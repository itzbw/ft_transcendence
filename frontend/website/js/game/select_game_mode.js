import { loadContent } from "../tools/tools.js";
import { applyLanguage } from "../tools/language.js";

export async function setGameModeSelection() {

	// load the template
	await loadContent('static/game/select_game_mode.html', 'main-box', applyLanguage);
}
