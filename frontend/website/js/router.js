import { applyLanguage } from "./language.js";

// select the element:
const contentDiv = document.getElementById('aboutContainer');

// Load html file's content and insert it in the div:
export function loadContent(file, callback) {
	fetch(file)
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not OK');
			}
			return response.text();
		})
		.then(html => {
			//Insert the content in the div:
			contentDiv.innerHTML = html;
			if (typeof callback === 'function') {
				callback();
			}
		})
		.catch(error => {
			console.error('Error fetching content: ', error);
		});
}
