import {socket, game, player, opponents, update } from './behavior.js'; 
import utility from './utility.js';
import actionCardManager from './cardManager.js'; 
import playerActions from './playerActions.js';
import justSayNo from './cards/companionCards/justSayNo.js';
import dealBreaker from './cards/attackCards/dealBreaker.js';
import debtCollector from './cards/attackCards/debtCollector.js';
import forcedDeal from './cards/attackCards/forcedDeal.js';

let intervalID; 

export default function socketReceiver() {

    socket.on("startGame", (msg) => {
        console.log("Game has started"); 
        document.getElementsByClassName("game")[0].style.display = "block"; 
        game.turn = msg.turn;
        if (game.turn == player.id) 
            console.log("It's your turn"); 
        else
            console.log("It's " + game.turn + " turn");
        intervalID = window.setInterval(update, 1000);
    })
    
    socket.on("dealCards", (cards) => {
        player.cardsInHand = cards; 
        player.numCardsInHand = cards.length; 
        console.log("I drew 5 cards: ");
        for (let i = 0; i < cards.length; i++) 
            console.log(cards[i]);  
    })
    
    socket.on("addPlayer", (player) => {
        opponents[player.id] = player; 
        console.log("New Player Has Joined The Lobby: id= " + player.id); 
    })
    
    socket.on("opponentDrawCards", (id) => {
        let opponent = opponents[id]; 
        opponent.numCardsInHand += 2; 
        console.log(opponent.id + " drew 2 cards");
    })
    
    socket.on("removePlayer", (card) => {
    
    })
    
    socket.on("opponentAddToMoneyPile", (msg) => {
        console.log("Opponent Added Money to Pile");
        let opponent = opponents[msg.opponent_id]; 
        opponent.movesRemaining = msg.movesRemaining; 
        opponent.topOfMoneyPile = msg.topOfMoneyPile; 
        opponent.totalMoneyPile = msg.totalMoneyPile; 
    })
    
    socket.on("opponentPlacePropertyCard", (msg) => {
        console.log("Opponent Placed Property Card");
        let opponent = opponents[msg.opponent_id]; 
        opponent.movesRemaining = msg.movesRemaining; 
        let propertySetIndex = utility.getObjectIndexFromID(msg.propertySet, msg.propertySet.id);
        if (propertySetIndex == -1) 
            opponent.propertySets.push(msg.propertySet); 
        else
            opponent.propertySets[propertySetIndex].properties.push(msg.card); 
    })

    socket.on("oppponentMovePropertyCard", (msg) => {
        console.log("Opponent Moved Property Card");
        let opponent = opponents[msg.opponent_id]; 
        let card = msg.card; 
        let source = opponent.getObjectIndexFromID(opponent.propertySets, msg.sourcePropertySet.id); 
        let destination = opponent.getObjectIndexFromID(opponent.propertySets, msg.destinationPropertySet.id);; 
        opponent.movesRemaining = msg.movesRemaining; 
        utility.removeIndexWithID(source.properties, card.id); 
        if (source.properties.length == 0) 
            utility.removeIndexWithID(opponent.propertySets, source.id); 
        if (destination == -1)
            player.propertySets.push(msg.destinationPropertySet); 
        else
            destination.properties.push(card);
    })

    socket.on("opponentActionCardNotify", ({cardType, opponent_id}) => {
        let opponent = opponents[opponent_id]; 
        console.log("Opponent " + opponent_id + " placed a(n) " + cardType );
    })

    socket.on("opponentActionCardPlay", (msg) => {
        actionCardManager.request(msg); 
    })

    socket.on("opponentActionCardResponse", (msg) => {
        actionCardManager.response(msg); 
    })

    socket.on("opponentActionCardForfeit", (msg) => {
        actionCardManager.forfeit(msg); 
    })

    socket.on("justSayNo", (msg) => {
        actionCardManager.justSayNo(msg); 
    }) 
}

