var express = require('express'); 
var app = express(); 
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => res.sendFile(__dirname + "/public/game.html"));
app.use(express.static('public'));

//app.use('/public',require('express').static(__dirname + '/public'));
 
http.listen(3000);
console.log("server started");

var games = {};
var players = {}; 

function newID() {
    return Math.random().toString(36).substr(2, 9);
}

function newDeck(gameID) {
    var game = games[gameID]; 
    var deck = []; 
    var cardTypes = ["actionCards", "propertyCards", "wildcards", "rentcards", "moneyCards"]; 
    for (var index in cardTypes) {
        cardType = cardTypes[index];
        for (var card in game[cardType]) {
            for (var i = 0; i < game[cardType][card]["count"]; i++) {
                deck.push(card); 
            }
        }
    }
    shuffle(deck); 
    return deck; 
}

function shuffle(arr) {
    for (var i = arr.length - 1; i >= 0; i--) {
        var j = Math.floor(Math.random() * i); 
        var temp = arr[i]; 
        arr[i] = arr[j]; 
        arr[j] = temp; 
    }
}

const gameStatus = {
    IN_LOBBY : "inLobby",
    IN_GAME : "inGame", 
    GAME_OVER : "gameOver",
}

function newGame() {
    var gameID = newID();
    games[gameID] = {
        "status" : gameStatus.IN_LOBBY,
        "players" : [],
        "turn" : null,
        "deck" : [], 
        "actionCards" : {
            "dealBreaker" : {"count" : 2, "value" : 5},
            "justSayNo" : {"count" : 3, "value" : 4},
            "slyDeal" : {"count" : 3, "value" : 3},
            "forceDeal" : {"count" : 4, "value" : 3}, 
            "debtCollector" : {"count" : 3, "value" : 3},
            "itsMyBirthday" : {"count" : 3, "value" : 2},
            "passGo" : {"count" : 10, "value" : 1},
            "house" : {"count" : 3, "value" : 3},
            "hotel" : {"count" : 3, "value" : 4},
            "doubleRent" : {"count" : 2, "value" : 1},
        },
        "propertyCards" : {
            "balticAve" : {"count" : 1, "color" : "brown"},
            "mediterraneanAve" : {"count" : 1, "color" : "brown"},
            "boardwalk" : {"count" : 1, "color" : "darkBlue"},
            "parkPlace" : {"count" : 1, "color" : "darkBlue"},
            "northCarolinaAve" : {"count" : 1, "color" : "green"},
            "pacificAve" : {"count" : 1, "color" : "green"},
            "pennsylvaniaAve" : {"count" : 1, "color" : "green"},
            "connecticutAve" : {"count" : 1, "color" : "lightBlue"},
            "orientalAve" : {"count" : 1, "color" : "lightBlue"},
            "vermontAve" : {"count" : 1, "color" : "lightBlue"},
            "newYorkAve" : {"count" : 1, "color" : "orange"},
            "stJamesPl" : {"count" : 1, "color" : "orange"},
            "tennesseeAve" : {"count" : 1, "color" : "orange"},
            "stCharlesPl" : {"count" : 1, "color" : "purple"},
            "virginiaAve" : {"count" : 1, "color" : "purple"},
            "statesAve" : {"count" : 1, "color" : "purple"},
            "shortLine" : {"count" : 1, "color" : "railroad"},
            "boRailroad" : {"count" : 1, "color" : "railroad"},
            "readingRailroad" : {"count" : 1, "color" : "railroad"},
            "pennsylvaniaRailroad" : {"count" : 1, "color" : "railroad"},
            "kentuckyAve" : {"count" : 1, "color" : "red"},
            "indianaAve" : {"count" : 1, "color" : "red"},
            "illinoisAve" : {"count" : 1, "color" : "red"},
            "waterWorks" : {"count" : 1, "color" : "utility"},
            "electricCompany" : {"count" : 1, "color" : "utility"},
            "ventnorAve" : {"count" : 1, "color" : "yellow"},
            "marvinGardens" : {"count" : 1, "color" : "yellow"},
            "atlanticAve" : {"count" : 1, "color" : "yellow"},
        },
        "propertyColors" : {
            "brown" : {"value" : 1, "fullSet" : 2}, 
            "darkBlue" : {"value" : 4, "fullSet" : 2}, 
            "green" : {"value" : 4, "fullSet" : 3}, 
            "lightBlue" : {"value" : 1, "fullSet" : 3}, 
            "orange" : {"value" : 2, "fullSet" : 3}, 
            "purple" : {"value" : 2, "fullSet" : 3}, 
            "railroad" : {"value" : 2, "fullSet" : 4}, 
            "red" : {"value" : 3, "fullSet" : 3}, 
            "utility" : {"value" : 2, "fullSet" : 2}, 
            "yellow" : {"value" : 3, "fullSet" : 3},
        },
        "wildcards" : {
            "darkBlueAndGreen" : {"count" : 1, "value" : 4, "color1" : "darkBlue", "color2" : "green"},
            "lightBlueAndBrown" : {"count" : 1, "value" : 1, "color1" : "lightBlue", "color2" : "brown"},
            "purpleAndOrange" : {"count" : 2, "value" : 2, "color1" : "purple", "color2" : "orange"},
            "railroadAndGreen" : {"count" : 1, "value" : 4, "color1" : "railroad", "color2" : "green"},
            "lightBlueAndRailroad" : {"count" : 1, "value" : 4, "color1" : "lightBlue", "color2" : "railroad"},
            "utilityAndRailroad" : {"count" : 1, "value" : 2, "color1" : "utilty", "color2" : "railroad"},
            "redAndYellow" : {"count" : 2, "value" : 3, "color1" : "red", "color2" : "yellow"},
            "multi" : {"count" : 2, "value" : 0, "color1" : "any", "color2" : "any"}
        },
        "rentCards" : {
            "greenAndDarkBlue" : {"count" : 2, "value" : 1, "color1" : "green", "color2" : "darkBlue"},
            "brownAndLightBlue" : {"count" : 2, "value" : 1, "color1" : "brown", "color2" : "lightBlue"},
            "purpleAndOrange" : {"count" : 2, "value" : 1, "color1" : "purple", "color2" : "orange"},
            "railroadAndUtility" : {"count" : 2, "value" : 1, "color1" : "railroad", "color2" : "utility"}, 
            "redAndYellow" : {"count" : 2, "value" : 1, "color1" : "red", "color2" : "yellow"},
            "multi" : {"count" : 3, "value" : 3, "color1" : "any", "color2" : "any"},
        },
        "moneyCards" : {
            "tenMil" : {"count" : 1, "value" : 10},
            "oneMil" : {"count" : 6, "value" : 1},
            "twoMil" : {"count" : 5, "value" : 2},
            "threeMil" : {"count" : 3, "value" : 3},
            "fourMil" : {"count" : 4, "value" : 4},
            "fiveMil" : {"count" : 2, "value" : 5},
        }
    };
    return gameID;  
}

function newPlayer(socket, gameID) {
    players[socket.id] = {
        "gameID" : gameID,
        "playerID" : socket.id,
        "banner" : "red",
        "cardsInHand" : [], 
        "numCardsInHand" : 0,
        "totalMoneyPile" : 0, 
        "moneyPile" : [], 
        "topOfMoneyPile" : "",
        "properties" : [], 
        "movesLeft" : 0, 

    }; 
    socket.join(gameID);
    games[gameID]["players"].push(socket.id); 
    return socket.id; 
}

function getPlayerInfoFor(gameID, playerID) {
    playerInfo = []; 
    var game = games[gameID]; 
    for (var i = 0; i < game["players"].length; i++) {
        var privatePlayerID = game["players"][i];
        if (privatePlayerID == playerID) {
            playerInfo.push(players[privatePlayerID]);
            continue; 
        }
        var publicPlayer = getPublicPlayerInfo(privatePlayerID); 
        playerInfo.push(publicPlayer); 
    }
    return playerInfo; 
    
}

function getPublicPlayerInfo(playerID) {
    var privatePlayer = players[playerID];
    var publicPlayer = {
        "playerID" : privatePlayer["playerID"],
        "banner" : privatePlayer["banner"],
        "numCardsInHand" : privatePlayer["numCardsInHand"], 
        "totalMoneyPile" : privatePlayer["totalMoneyPile"],
        "topOfMoneyPile" : privatePlayer["topOfMoneyPile"],
        "properties" : privatePlayer["properties"],
        "movesLeft" : privatePlayer["movesLeft"],
    }; 
    return publicPlayer;
}

//not implemented
function cleanupUser(socket) {
    console.log(socket.id); 
}

function dealCards(gameID) {
    var players = games[gameID]["players"]; 
    for (var i = 0; i < 5; i ++) {
        for (var j = 0; j < players.length; j++) {
            var card = games[gameID]["deck"].pop(); 
            io.to(players[j]).emit("youDrawCard", card);
            io.sockets.connected[players[j]].to(gameID).emit("playerDrawCard", players[j]); 
        }
    }

}

io.on("connection", (socket) => {

    socket.on("disconnect", () => {
        cleanupUser(socket);
    }) 

    socket.on("enterLobbyAsLeader", (msg, fn) => {
        var gameID = newGame(); 
        var playerID = newPlayer(socket, gameID);    
        fn({"gameID" : gameID, "playerID" : playerID, "playerInfo" : getPlayerInfoFor(gameID, playerID)});
    });

    socket.on("enterLobbyAsPleb", (msg, fn) => {
        var gameID = msg; 
        if (!(gameID in games)) {
            fn({"error" : "invalidGameID"}); 
        }
        else if (games[gameID]["status"] != gameStatus.IN_LOBBY) {
            fn({"error" : "notInLobby"})
        }
        var playerID = newPlayer(socket, gameID); 
        socket.to(gameID).emit("addPlayer", getPublicPlayerInfo(playerID));
        var response = {"playerID" : playerID, "playerInfo" : getPlayerInfoFor(gameID, playerID) };
        fn(response); 
    });
    socket.on("startGame", (msg, fn) => {
        var gameID = msg; 
        game = games[gameID]; 
        var playerLength = game["players"].length; 
        game["turn"] = Math.floor(Math.random() * playerLength); 
        game["status"] = gameStatus.IN_GAME; 
        game["deck"] = newDeck(gameID); 
        var response = {
            "turn" : game["players"][game["turn"]],
        }
        io.to(gameID).emit("startGame", response);
        dealCards(gameID); 
    });


    socket.on("draw", (msg, fn) => {
        console.log(msg);
        fn({error : "none"});
    });


});




