

function selectGameMode(mode) {
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
    mainWindow.innerHTML = '<p>Loading vs Bot Game...</p>';
    console.log("vsBot game loaded");
    window.setupVsBot();
  }
  else if (mode === 'vsHuman') {
    mainWindow.innerHTML = '<p>Loading vs Human Game...</p>';
    console.log("vsHuman game loaded");
    window.setupVsHuman();
  }
  else if (mode === 'tournament') {
    mainWindow.innerHTML = '<p>Loading Tournament Game...</p>';
    console.log("tournament game loaded");
  }
}

