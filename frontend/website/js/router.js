import { applyLanguage } from "./language.js";

// Load html file's content and insert it in the div:
export function loadContent(file, element, callback) {
	fetch(file)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not OK');
			}
			return response.text();
		})
		.then(html => {
			//Insert the content in the div:
			element.innerHTML = html;
			if (typeof callback === 'function') {
				callback();
			}
		})
		.catch(error => {
			console.error('Error fetching content: ', error);
		});
}
