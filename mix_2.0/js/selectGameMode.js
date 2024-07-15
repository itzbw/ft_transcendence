
export function selectGameMode(mode) {
  if (mode === 'vsBot') {
    loadGame('vsBot');
    console.log("vsBot selectgame loaded");
  }
  else if (mode === 'vsHuman') {
    loadGame('vsHuman');
    console.log("vsHuman selectgame loaded");
  } else if (mode === 'tournament') {
    loadGame('tournament');
    console.log("tournament selectgame loaded");
  }
}

function loadGame(mode) {
  const mainWindow = document.getElementById('main-window');
  var script = document.createElement('script');
  if (mode === 'vsBot') {
    if (typeof window.vsBotanimate === 'function') {
      window.setupVsBot();
    } else {
      console.error('setupVsBot is not a function');
    }
  }
  else if (mode === 'vsHuman') {
    if (typeof window.vsBotanimate === 'function') {
      window.setupVsHuman();
    } else {
      console.error('setupVsHuman is not a function');
    }
  }
  else if (mode === 'tournament') {
    mainWindow.innerHTML = '<p>Loading Tournament Game...</p>';
    console.log("tournament game loaded");
  }
}

