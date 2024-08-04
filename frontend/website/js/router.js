import { executeScripts } from './tools.js'

const urlPageTitle = "PONG PONG";


// create an object that maps the url to the template, title, and description
const routes = {
	404: {
		template: "/templates/404.html",
		title: "404 | " + urlPageTitle,
		description: "Page not found",
	},
	"/": {
		template: "/templates/home.html",
		title: "Front | " + urlPageTitle,
		description: "This is the home page",
	},
	"profile": {
		template: "/templates/profile.html",
		title: "Profile | " + urlPageTitle,
		description: "This is the Profile page",
	},
	"gamemenu": {
		template: "/templates/gamemenu.html",
		title: "Game Menu | " + urlPageTitle,
		description: "This is the leaderboard page",
	},
	"leaderboard": {
		template: "/templates/leaderboard.html",
		title: "Leaderboard | " + urlPageTitle,
		description: "This is the leaderboard page",
	},
	"chat": {
		template: "/templates/chat.html",
		title: "Chat | " + urlPageTitle,
		description: "This is the chat page",
	},
	"pongvsbot": {
		template: "/templates/pongvsbot.html",
		title: "Pong vs Bot | " + urlPageTitle,
		description: "This is the pongvsbot page",
	},
	"pongvsman": {
		template: "/templates/pongvsman.html",
		title: "Pong vs Man | " + urlPageTitle,
		description: "This is the pongvsman page",
	},
	"tournament": {
		template: "/templates/tournament.html",
		title: "Tournament | " + urlPageTitle,
		description: "This is the contact page",
	},
};

// create a function that watches the url and calls the urlLocationHandler
export const locationHandler = async () => {
	// get the url path, replace hash with empty string
	var location = window.location.hash.replace("#", "");
	// if the path length is 0, set it to primary page route
	if (location.length == 0) {
		location = "/";
	}
	// get the route object from the routes object
	const route = routes[location] || routes["404"];
	// get the html from the template
	const html = await fetch(route.template).then((response) => response.text());

	const mainWindow = document.getElementById("main-box");
	// set the content of the content div to the html
	mainWindow.innerHTML = html;
	executeScripts(mainWindow)

	// set the title of the document to the title of the route
	document.title = route.title;
	// set the description of the document to the description of the route
	document
		.querySelector('meta[name="description"]')
		.setAttribute("main-window", route.description);
};


// create a function that watches the hash and calls the urlLocationHandler
window.addEventListener("hashchange", locationHandler);

