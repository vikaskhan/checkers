import {socket, game, player, opponents} from '../behavior.js'; 
import utility from '../utility.js'; 

let money = {
    add : function(card) {
        socket.emit("addToMoneyPile", {"card_id" : card.id}, (msg) => {
            utility.removeIndexWithID(player.cardsInHand, card.id); 
            player.movesRemaining = msg.movesRemaining; 
            player.moneyPile = msg.moneyPile; 
            player.topOfMoneyPile = msg.topOfMoneyPile; 
            player.totalMoneyPile = msg.totalMoneyPile; 
        });
    },

    canAdd : function(card) {
        if (card.cardType != "propertyCards" && card.cardType != "wildcards" )
            return true; 
        return false; 
    }, 
}

export default money; 

