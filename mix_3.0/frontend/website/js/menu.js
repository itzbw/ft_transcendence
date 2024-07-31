import { setupVsBot } from "/js/vsBot.js"

const playVsBotBtn = document.querySelector('#play-vs-bot')
playVsBotBtn.addEventListener('click', () => {
  setupVsBot()
})