var socket = io();

var gameID; 
var playerID; 
var players = {}; 



function initialize() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    gameID = urlParams.get('id'); 
    if(gameID != null) {
        enterLobbyAsPleb(); 
    }

}

function startGame() {
    socket.emit("startGame", gameID);
}


socket.on("startGame", (msg) => {
    console.log("Game is Starting");
    document.getElementsByClassName("game")[0].style.display = "block"; 
    var turn = msg["turn"];
    console.log(playerID); 
    if (turn == playerID) 
        console.log("It's your turn"); 
    else
        console.log("It's " + turn + " turn");
})

socket.on('getPlayerInfo', (msg) => {

})

socket.on('playerTurnUpdate', (msg) => {

}); 

socket.on('playerMove', (msg) => {

})

socket.on('userDisconnect', (msg) => {

})

socket.on('playerReadyUp', (msg) => {

})

socket.on('playerJoin', (msg) => {

})

socket.on('gameStart', (msg) => {

})

socket.on('gameSettingUpdate', (msg) => {

})

socket.on('getGameSettings', (msg) => {
    
})

socket.on('playerMoveAction', (msg) => {

})

socket.on('lobby', (msg) => {

})

socket.on("addPlayer", (msg) => {
    players[msg["playerID"]] = msg; 
    console.log("New Player Has Joined The Lobby"); 
    console.log(msg); 
})

socket.on("removePlayer", (msg) => {

})

function drawCards() {
    socket.emit("draw", "", (msg) => {
        console.log("draw 2"); 
        
    });
}

socket.on("youDrawCard", (msg) => {
    card = msg; 
    console.log("drawing card:" + card); 
    players[playerID]["numCardsInHand"]++; 
    players[playerID]["cardsInHand"].push(card); 
})

socket.on("playerDrawCard", (msg) => {
    console.log(msg + " drew a card"); 
})

function enterLobbyDisplay() {
    document.getElementsByClassName("start_screen")[0].style.display = "none";
    var lobby = document.getElementsByClassName("lobby")[0]; 
    lobby.style.display = "block";
}

function enterLobbyAsPleb() {
    enterLobbyDisplay(); 
    document.getElementsByClassName("game_link")[0].setAttribute("value", "localhost:3000/?id=" +  gameID);
    socket.emit("enterLobbyAsPleb", gameID, (msg) => {
        if (msg["error"] == "invalidGameID" || msg["error"] == "notInLobby") {
            console.log("Error 404"); 
        }
        else {
            playerID = msg["playerID"];
            console.log(msg); 
            for (var i = 0; i < msg["playerInfo"].length; i++) {
                players[msg["playerInfo"][i]["playerID"]] = msg["playerInfo"][i]; 
            }
        }
    })
    console.log(players);
}

function enterLobbyAsLeader() {
    enterLobbyDisplay(); 
    socket.emit("enterLobbyAsLeader", "", (msg) => {
        gameID = msg["gameID"]; 
        playerID = msg["playerID"];
        document.getElementsByClassName("game_link")[0].setAttribute("value", "localhost:3000/?id=" +  gameID);
        document.getElementsByClassName("startGameButton")[0].removeAttribute("disabled"); 
        players[msg["playerInfo"][0]["playerID"]] = msg["playerInfo"][0]; 
    });
    console.log(players); 
}

function copyID() {
    var link = document.getElementsByClassName("game_link")[0]; 
    link.select();
    link.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

initialize(); 