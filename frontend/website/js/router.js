
// Load html file's content and insert it in the div:
export async function loadContent(file, elementID, callback) {
	const element = document.getElementById(elementID);

	try {
		const response = await fetch(file)
		if (!response.ok) {
			throw new Error('Network response was not OK');
		}
		const html = await response.text();

		if (element) {
			//Insert the content in the div:
			element.innerHTML = html;
			if (typeof callback === 'function') {
				callback();
			}
		}
	} catch (error) {
		console.error('Error fetching content:', error);
	}
}
