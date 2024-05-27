import * as THREE from 'three';

import "./frontpage.js"
import { setupVsBot } from "./gameVsBot.js"
import { setupVsHuman } from "./gameVsHuman.js"


var ball1 = document.getElementById("ball1");
var ball2 = document.getElementById("ball2");

document.getElementById("ball1").onclick = function () {

  setupVsHuman();
}

document.getElementById("ball2").onclick = function () {

  setupVsBot();
}