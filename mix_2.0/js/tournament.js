

const players = []
var input = document.getElementById("playerName");


input.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        addFriendFields()
    }
})

function addFriendFields() {
    if (input.value == "" || players.includes(input.value) == true) {
        return
    }
    players.push(input.value)
    input.value = ""
    var mydiv = document.getElementById("players");
    mydiv.innerHTML = renderPlayerList(players)
    console.log(players)
}

function renderPlayerList(names) {
    let html = "Players:"
    let minPlayers = 3 - players.length;
    for (const name of names) {
        html += "<br/>" + name
    }
    if (minPlayers > 0) {
        html += "<br/>" + minPlayers + " players left to start"
    }
    else {
        // html += "<br/> <button onclick='loadTournament()'> Game is ready to start</button > ";
        html += "<br/> <button onclick='startTournament()' > Game is ready to start</button > ";
    }
    return html
}

window.startTournament = function startTournament() {
    window.location.href = '/?players=' + JSON.stringify(players) + '#tournamentgame';
}


window.addFriendFields = addFriendFields;

// addFriendFields();