// ---------- loadContent () ---------------- 
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

// Unused for now
export async function cleanContent(elementID){
	const element = document.getElementById(elementID);

	if (element) {
		element.innerHTML = '';
	} else {
		console.warn(`Element with ID ${elementID} not found.`);
	}
}

// -------------------------- 

// ---------- getCookie() --------------------
// Get cookie to avoid CSRF error
export function getCookie(name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

export function getAccessToken() {
    return localStorage.getItem('access_token');
}

// ------------------------------


// ------------------------------
export function setAttribute(elementId, attributeName, attributeValue) {
    const element = document.getElementById(elementId);
    if (element) {
        element.setAttribute(attributeName, attributeValue);
    }
}


export async function PingServer() {
	try {
		const response = await fetch('/api/users/update_status/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': getCookie('csrftoken'),
				'Authorization': `Bearer ${getAccessToken()}`,
			},
		});
		if (!response.ok) {
			console.error('Failed to update status');
		}
	} catch (error) {
		console.error('Error during status update:', error);
	}
}
