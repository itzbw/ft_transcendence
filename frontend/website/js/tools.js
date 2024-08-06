// User profile (kept for TEST) ** TO_REMOVE **
import { showUserProfile } from './users/user_profile.js';

// ---------- START executeScript() ---------------- 
export function executeScripts(node) {
	if (nodeScriptIs(node) === true) {
		node.parentNode.replaceChild(nodeScriptClone(node), node);
	}
	else {
		var i = -1, children = node.childNodes;
		while (++i < children.length) {
			executeScripts(children[i]);
		}
	}

	return node;
}

function nodeScriptClone(node) {
	var script = document.createElement("script");
	script.text = node.innerHTML;

	var i = -1, attrs = node.attributes, attr;
	while (++i < attrs.length) {
		script.setAttribute((attr = attrs[i]).name, attr.value);
	}
	return script;
}

function nodeScriptIs(node) {
	return node.tagName === 'SCRIPT';
}
// -------------------------- 

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
// ------------------------------







// ------------------------------
// ** TO_REMOVE **
export function addTestButton(){
	// FOR TESTS ONLY  ** TO_REMOVE **
	// create a button to see another account's profile
	const test = document.getElementById('testButton');
	test.addEventListener('click', function(){
		showUserProfile("toto");		// Change username HERE
	});
}

// ------------------------------
export function setAttribute(elementId, attributeName, attributeValue) {
    const element = document.getElementById(elementId);
    if (element) {
        element.setAttribute(attributeName, attributeValue);
		console.log ("set to", elementId, "the attribute", attributeName, "with value", attributeValue);
    }
}