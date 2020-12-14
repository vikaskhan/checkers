const { timingSafeEqual } = require('crypto');
var express = require('express'); 
var app = express(); 
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => res.sendFile(__dirname + "/public/game.html"));
app.use(express.static('public'));

//app.use('/public',require('express').static(__dirname + '/public'));
 
http.listen(3000);
console.log("server started");

let games = {};
let players = {}; 

function newID() {
    return Math.random().toString(36).substr(2, 9);
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

function Card (cardName, cardType, attributes) {
    this.id = newID(); 
    this.cardName = cardName; 
    this.cardType = cardType; 
    this.attributes = attributes; 
}

function PropertySet(color) {
    this.id = newID(); 
    this.color = color; 
    this.properties = []; 

    this.addProperty = function (card) {
        this.properties.push(card); 
    }

    this.removeProperty = function (card) {
        for (let i = 0; i < this.properties.length; i++) 
            if (card.id == this.properties[i].id)
                this.properties.splice(i, 1); 
    }
}

function Deck(game) {

    this.deck = []; 

    this.initialize = function() {
        let cardStats = game.cardStats.getCardStats(); 
        for (let [cardType, value] of Object.entries(cardStats)) {
            for (let [cardName, attributes] of Object.entries(value)) {
                for (let i = 0; i < attributes.count; i++) {
                    this.deck.push(new Card(cardName, cardType, attributes)); 
                }
            }
        }
        this.shuffleDeck(); 
    }

    this.getNextCard = function () {
        let card = this.deck.pop();
        return card; 
    }; 

    this.shuffleDeck = function () {
        Utility.shuffle(this.deck); 
    }; 

    this.initialize(); 
}

const gameStatus = {
    IN_LOBBY : "inLobby",
    IN_GAME : "inGame", 
    GAME_OVER : "gameOver",
}

const turnStatus = {
    DRAWING_CARDS : "drawingCards", 
}

const propertyColors = {
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
};




function CardStats() {
    this.cardStats = {
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
    }
    this.getCardStats = function() {
        return this.cardStats; 
    }
    this.getCardAttribute = function(card, attribute) {
        return this.cardStats[card.cardType][card.cardName][attribute];
    }
}

function Game() {

    Game.games = {}; 

    this.id = newID();
    this.status = gameStatus.IN_LOBBY;
    this.players = []; 
    this.turn = null; 
    this.turnStatus = null;
    this.deck = null; 
    this.cardStats = new CardStats(); 

    games[this.id] = this;  

    Game.getGame = function(id) {
        return games[id]; 
    }

    this.getPublicGameInfo = function() {
        return {
            id : this.id,
            status : this.status, 
            turn : this.turn, 
            turnStatus : this.turnStatus, 
            numberOfCardsPerTurn : this.numberOfCardsPerTurn, 
            cardStats : this.cardStats, 
        } 
    }

    this.dealCards = function() {
        for (let j = 0; j < this.players.length; j++) {
            this.players[j].socket.emit("dealCards", this.players[j].drawCards(5)); 
        }
    }

    this.getPlayerData = function(player) {
        let playerInfo = []; 
        for (let i = 0; i < this.players.length; i++) {
            if (player != this.players[i]) 
                playerInfo.push(this.players[i].getPublicPlayerInfo()); 
        }
        playerInfo.push(player.getPrivatePlayerInfo());
        return playerInfo; 
    }

    this.startGame = function() {
        this.turn = Math.floor(Math.random() * this.players.length); 
        this.status = gameStatus.IN_GAME; 
        this.deck = new Deck(this); 
        let res = {"turn" : this.players[this.turn].id}
        io.to(this.id).emit("startGame", res);
        this.dealCards(); 
    }

    this.cleanup = function(player) {
        //Not Implemented
    }

}

function Player(socket, game) {

    Player.players = {}; 

    this.id = socket.id; 
    this.socket = socket; 
    this.gameID = game.id; 
    this.game = game; 
    this.banner = "red"; 
    this.cardsInHand = []; 
    this.numCardsInHand = 0; 
    this.moneyPile = []; 
    this.topOfMoneyPile = "";
    this.totalMoneyPile = 0; 
    this.propertySets = []; 
    this.movesRemaining = 0; 

    players[this.id] = this; 

     Player.getPlayer = function(id) {
        return players[id]; 
    }

    this.initialize = function() {
        socket.join(this.gameID);
        game.players.push(this);
    }

    this.getPrivatePlayerInfo = function() {
        return {
            id : this.id,
            gameID : this.gameID,  
            banner : this.banner, 
            cardsInHand : this.cardsInHand, 
            numCardsInHand : this.numCardsInHand, 
            moneyPile : this.moneyPile, 
            topOfMoneyPile : this.topOfMoneyPile,
            totalMoneyPile : this.totalMoneyPile,
            propertySets : this.propertySets,
            movesRemaining : this.movesRemaining,             
        }; 
    }

    this.getPublicPlayerInfo = function() {
        return {
            id : this.id, 
            banner : this.banner,
            numCardsInHand : this.numCardsInHand, 
            totalMoneyPile : this.totalMoneyPile,
            topOfMoneyPile : this.topOfMoneyPile,
            properties : this.properties,
            movesLeft : this.movesLeft,
        }
    }

    this.drawCards = function(numOfCards) {
        let cards = []; 
        for (let i = 0; i < numOfCards; i++) {
            let card = game.deck.getNextCard();
            cards.push(card); 
            this.cardsInHand.push(card); 
            this.numCardsInHand++; 
        }
        return cards; 
    }

    this.addToMoneyPile = function(card) {
        Utility.removeIndexWithID(this.cardsInHand, card.id);
        this.movesRemaining--; 
        this.moneyPile.push(card); 
        this.topOfMoneyPile = card;
        this.totalMoneyPile+=this.game.cardStats.getCardAttribute(card, "value");
        this.socket.to(this.gameID).emit("opponentAddToMoneyPile", card); 
        return this.getPrivatePlayerInfo();
    }

    this.placeActionCard = function(card) {
        Utility.removeIndexWithID(this.cardsInHand, card.id);
        this.movesRemaining--; 
        this.socket.to(this.gameID).emit("opponentPlaceActionCard", card); 
        return this.getPrivatePlayerInfo(); 
    }

    this.placePropertyCard = function(card, propertySet, color) {
        Utility.removeIndexWithID(this.cardsInHand, card.id);
        this.movesRemaining--; 
        if (propertySet == -1) {
            propertySet = new PropertySet(color);
        }
        propertySet.addProperty(card); 
        this.socket.to(this.gameID).emit("opponentPlacePropertyCard", {
            "propertySet" : propertySet, 
            "card" : card
        }); 
        return propertySet; 
    }

    this.movePropertyCard = function(card, sourcePropertySet, destinationPropertySet) {
        sourcePropertySet.removeProperty(card); 
        destinationPropertySet.addProperty(card); 
        this.socket.to(this.gameID).emit("oppponentMovePropertyCard", {
            "sourcePropertySet" : sourcePropertySet, 
            "destinationPropertySet" : destinationPropertySet, 
            "card" : card
        }); 
        return; 
    }

    this.getCard = function(id) {
        let cardIndex = Utility.getObjectIndexFromID(this.cardsInHand, id)
        return this.cardsInHand[cardIndex]; 
    }

    this.getPropertySet = function(id) {
        let propertySetIndex = Utility.getObjectIndexFromID(this.propertySets, id)
        return this.propertySets[propertySetIndex];
    }

    this.initialize(); 

}

io.on("connection", (socket) => {

    let player; 

    socket.on("enterLobbyAsLeader", (msg, fn) => {
        let game = new Game();  
        player = new Player(socket, game);   
        fn({"game" : game.getPublicGameInfo(), "players" : player.getPrivatePlayerInfo()});
    });

    socket.on("enterLobbyAsPleb", (msg, fn) => {
        let gameID = msg; 
        let game = Game.getGame(gameID);
        player = new Player(socket, game); 
        socket.to(gameID).emit("addPlayer", player.getPublicPlayerInfo());
        fn({"game" : game.getPublicGameInfo(), "players" : game.getPlayerData(player)}); 
    });

    socket.on("startGame", (msg, fn) => {
        player.game.startGame(); 
    });

    socket.on("drawCards", (msg, fn) => { 
        socket.to(gameID).emit("opponentDrawCards", player.id); 
        fn(player.drawCards(2));
    });

    socket.on("addToMoneyPile", (msg, fn) => {
        let card = player.getCard(msg["card_id"]); 
        fn(player.addToMoneyPile(card)); 
    }); 

    socket.on("placeActionCard", (msg, fn) => {
        let card = player.getCard(msg["card_id"]); 
        fn(player.placeActionCard(card)); 
    });

    socket.on("placePropertyCard", (msg, fn) => {
        let card = player.getCard(msg["card_id"]); 
        let propertySet = player.getPropertySet(player.msg["propertySet_id"]);
        fn(player.placePropertyCard(card, propertySet)); 
    });

    socket.on("movePropertyCard", (msg, fn) => {
        let card = player.getCard(msg["card_id"]); 
        let sourcePropertySet = player.getPropertySet(msg["sourcePropertySet_id"]); 
        let destinationPropertySet = player.getPropertySet(msg["destinationPropertySet_id"]);
        fn(player.movePropertyCard(card, sourcePropertySet, destinationPropertySet)); 
    });

    socket.on("endTurn", (msg) => {

    }); 

    socket.on("disconnect", function() {
        
    });

});