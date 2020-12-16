var socket = io();

let gameID; 
let playerID; 
let players = []; 
let game; 
let intervalID; 

function initialize() {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    gameID = urlParams.get('id'); 
    if(gameID != null)
        enterLobbyAsPleb(); 
}

function enterLobbyAsPleb() {
    enterLobbyDisplay(); 
    document.getElementsByClassName("game_link")[0].setAttribute("value", "localhost:3000/?id=" +  gameID);
    socket.emit("enterLobbyAsPleb", gameID, (msg) => {
        players = msg.players; 
        playerID = players[players.length-1].id;
        game = msg.game; 
    })
}

function enterLobbyAsLeader() {
    enterLobbyDisplay(); 
    socket.emit("enterLobbyAsLeader", "", (msg) => {
        game = msg.game; 
        gameID = game.id; 
        players.push(msg.players);
        playerID = players[0].id; 
        document.getElementsByClassName("game_link")[0].setAttribute("value", "localhost:3000/?id=" +  gameID);
        document.getElementsByClassName("startGameButton")[0].removeAttribute("disabled"); 
    });
}

function getPlayer(id) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == id) 
            return players[i]; 
    }
    return -1;
}

function startGame() {
    socket.emit("startGame", gameID);
}

function drawCards() {
    let player = getPlayer(playerID); 
    socket.emit("drawCards", "", (cards) => {
        for (let i = 0; i < cards.length; i++) {
            player.cardsInHand.push(cards[i]); 
            player.numCardsInHand++; 
        }
    }); 
}

function endTurn() {
    socket.emit("endTurn", playerID);
}

socket.on("startGame", (msg) => {
    console.log("Game has started"); 
    document.getElementsByClassName("game")[0].style.display = "block"; 
    let turn = msg.turn;
    if (turn == playerID) 
        console.log("It's your turn"); 
    else
        console.log("It's " + turn + " turn");
    intervalID = window.setInterval(update, 1000);
})

socket.on("dealCards", (cards) => {
    let player = getPlayer(playerID); 
    player.cardsInHand = cards; 
    player.numCardsInHand = cards.length; 
    console.log("I drew 5 cards: ");
    for (let i = 0; i < cards.length; i++) 
        console.log(cards[i]);  
})

socket.on("addPlayer", (player) => {
    players.push(player); 
    console.log("New Player Has Joined The Lobby: id= " + player.id); 
})

socket.on("opponentDrawCards", (id) => {
    let player = getPlayer(id); 
    player.numCardsInHand += 2; 
    console.log(player.id + " drew 2 cards");
})


socket.on("removePlayer", (card) => {

})

socket.on("opponentAddToMoneyPile", (card) => {
    console.log("Opponent Added Money to Pile");
    console.log(card); 
})

socket.on("opponentPlaceActionCard", (card) => {
    console.log("Opponent Placed Action Card");
    console.log(card); 
})

socket.on("opponentPlacePropertyCard", (msg) => {
    console.log("Opponent Placed Property Card");
    console.log(msg); 
    let card = msg.card; 
    let propertySet = msg.propertySet; 
})

socket.on("oppponentMovePropertyCard", (msg) => {
    console.log("Opponent Moved Property Card");
    console.log(msg); 
    let card = msg.card; 
    let sourcePropertySet = msg.sourcePropertySet; 
    let destinationPropertySet = msg.destinationPropertySet; 
})


function makeMove(move) {
    var txt = move.split(" "); 
    switch (txt[0]) {
        case "addToMoneyPile":
            addToMoneyPile(txt); 
            break; 
        case "placeActionCard":
            placeActionCard(txt); 
            break; 
        case "placePropertyCard":
            placePropertyCard(txt); 
            break; 
        case "movePropertyCard":
            movePropertyCard(txt); 
            break; 
    }

}

function Utility() {

    Utility.shuffle = function(arr) {
        for (var i = arr.length - 1; i >= 0; i--) {
            var j = Math.floor(Math.random() * i); 
            var temp = arr[i]; 
            arr[i] = arr[j]; 
            arr[j] = temp; 
        }
    }

    Utility.getObjectIndexFromID = function(arr, id) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == id) 
                return i; 
        }
        return -1; 
    }

    Utility.removeIndexWithID = function(arr, id) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == id) 
                arr.splice(i, 1); 
        }
        return;
    }

}

new Utility; 

function addToMoneyPile(txt) {
    console.log(txt); 
    let player = getPlayer(playerID); 
    let card_id = txt[1]; 
    console.log("addToMoneyPile");
    socket.emit("addToMoneyPile", {"card_id" : card_id}, (msg) => {
        console.log("response");
        console.log(msg); 
        Utility.removeIndexWithID(player.cardsInHand, card_id); 
        player.movesRemaining = msg.movesRemaining; 
        player.moneyPile = msg.moneyPile; 
        player.topOfMoneyPile = msg.topOfMoneyPile; 
        player.totalMoneyPile = msg.totalMoneyPile; 
    });

}

function placeActionCard(txt) {
    console.log(txt); 
    let player = getPlayer(playerID); 
    let card_id = txt[1]; 
    console.log("placeActionCard");
    socket.emit("placeActionCard", {"card_id" : card_id}, (msg) => {
        console.log("response");
        console.log(msg);
        Utility.removeIndexWithID(player.cardsInHand, card_id); 
    }); 
}

function placePropertyCard(txt) {
    console.log(txt); 
    let player = getPlayer(playerID); 
    let card_id; 
    let propertySet_id; 
    let color; 
    card_id = txt[1]; 
    propertySet_id = txt[2]; 
    color = txt[3]; 
    console.log("placePropertyCard");
    socket.emit("placePropertyCard", {"card_id" : card_id, "propertySet_id" : propertySet_id, "color" : color}, (msg) => {
        console.log("response");
        console.log(msg); 
        Utility.removeIndexWithID(player.cardsInHand, card_id); 
        let propertySet = msg.propertySet; 
        let card = msg.card; 
        propertySetIndex = Utility.getObjectIndexFromID(player.propertySets, propertySet.id); 
        if (propertySetIndex == -1) 
            player.propertySets.push(propertySet); 
        else
            player.propertySets[propertySetIndex] = propertySet; 
    });
}

function movePropertyCard(txt) {
    console.log(txt); 
    let player = getPlayer(playerID); 
    let card_id; 
    let sourcePropertySet_id; 
    let destinationPropertySet_id; 
    card_id = txt[1]; 
    sourcePropertySet_id = txt[2]; 
    destinationPropertySet_id = txt[3];
    console.log("movePropertyCard");
    socket.emit("movePropertyCard", {"card_id" : card_id, "sourcePropertySet_id" : sourcePropertySet_id, "destinationPropertySet_id" : destinationPropertySet_id}, (msg) => {
        console.log("response");
        console.log(msg); 
        Utility.removeIndexWithID(player.cardsInHand, card_id);
        let sourcePropertySet = msg.sourcePropertySet; 
        let destinationPropertySet = msg.destinationPropertySet; 
        let card = msg.card; 
        destinationPropertySetIndex = Utility.getObjectIndexFromID(player.propertySets, destinationPropertySet.id); 
        if (destinationPropertySetIndex == -1)
            player.propertySets.push(destinationPropertySet); 
        else 
            player.propertySets[destinationPropertySetIndex] = destinationPropertySet;
        sourcePropertySetIndex = Utility.getObjectIndexFromID(player.propertySets, sourcePropertySet.id); 
        player.propertySets[sourcePropertySetIndex] = sourcePropertySet;
    });
}

function enterLobbyDisplay() {
    document.getElementsByClassName("start_screen")[0].style.display = "none";
    var lobby = document.getElementsByClassName("lobby")[0]; 
    lobby.style.display = "block";
}

function copyID() {
    var link = document.getElementsByClassName("game_link")[0]; 
    link.select();
    link.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

function update() {

    let addToMoneyPileButton = "<button onclick='addToMoneyPile()'>Add Money</button>";
    let placeActionCardButton = "<button onclick='placeActionCard()'>Action</button>";
    let placePropertyCardButton = "<button onclick='placePropertyCard()'>Place Property</button>";
    let movePropertyCardButton = "<button onclick='movePropertyCard()'>Move Property</button>";

    let player = getPlayer(playerID); 

    let cardUL = document.getElementsByClassName("cards")[0];
    let propertyUL = document.getElementsByClassName("properties")[0]
    cardUL.innerHTML = ""; 
    propertyUL.innerHTML = ""; 


    let cards = player.cardsInHand; 
    let properties = player.propertySets;

    for (let i = 0; i < cards.length; i++) {
        let li = document.createElement('li'); 
        li.innerHTML = JSON.stringify(cards[i]) + addToMoneyPileButton; 
        li.setAttribute('style', 'display: block;'); 
        cardUL.appendChild(li); 
    }

    for (let i = 0; i < properties.length; i++) {
        let li = document.createElement('li'); 
        li.innerHTML = JSON.stringify(properties[i]); 
        li.setAttribute('style', 'display: block;'); 
        propertyUL.appendChild(li); 
    }
}

initialize(); 