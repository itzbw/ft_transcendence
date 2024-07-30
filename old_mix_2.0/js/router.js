import { executeScripts } from './utils/dom/executeScripts.js'

const urlPageTitle = "PONG PONG";

// create an object that maps the url to the template, title, and description
const routes = {
  404: {
    template: "/pages/404.html",
    title: "404 | " + urlPageTitle,
    description: "Page not found",
  },
  "/": {
    template: "/pages/frontpage.html",
    title: "frontpage | " + urlPageTitle,
    description: "This is the home page",
  },
  "profile": {
    template: "/pages/profile.html",
    title: "Profile | " + urlPageTitle,
    description: "This is the Profile page",
  },
  "leaderboard": {
    template: "/pages/leaderboard.html",
    title: "Profile | " + urlPageTitle,
    description: "This is the leaderboard page",
  },
  "chat": {
    template: "/pages/chat.html",
    title: "Profile | " + urlPageTitle,
    description: "This is the chat page",
  },
  "pongvsbot": {
    template: "/pages/pongvsbot.html",
    title: "About Us | " + urlPageTitle,
    description: "This is the pongvsbot page",
  },
  "pongvsman": {
    template: "/pages/pongvsman.html",
    title: "About Us | " + urlPageTitle,
    description: "This is the pongvsman page",
  },
  "tournament": {
    template: "/pages/tournament.html",
    title: "Tournament | " + urlPageTitle,
    description: "This is the contact page",
  },
};

// create a function that watches the url and calls the urlLocationHandler
const locationHandler = async () => {
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

  const mainWindow = document.getElementById("main-window");
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

// switch path for loading js in different page //
// check if login 

// switch(location){
//   case "#":
//   case "#home":
//     loadFrontPage();
//     console.log("home");
//   break;
//   default:
//     console.log("default");
//   break;
// }



// create a function that watches the hash and calls the urlLocationHandler
window.addEventListener("hashchange", locationHandler);
// call the urlLocationHandler to load the page
locationHandler();


