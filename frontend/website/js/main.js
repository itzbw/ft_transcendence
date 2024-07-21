import { loadContent } from './router.js';
import { translations, getTranslationForKey, applyLanguage, setLanguage } from './language.js';

document.addEventListener('DOMContentLoaded', function() {
	loadContent('static/about.html', applyLanguage);
    // applyLanguage();
});