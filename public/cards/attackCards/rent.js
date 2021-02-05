import {socket, game, player, opponents} from '../../behavior.js'; 
import doubleRent from '../companionCards/doubleRent.js'; 
import property from '../property.js';

let rent = {
    play : function(card) {
        let doubleRentCardID = ""; 
        if (doubleRent.getCardLocations() > 0) {
            // Ask the Player If they Want to Double the Rent
        }
        socket.emit("chargeRent", {"card_id" : card.id, "doubleRentCard_id" : doubleRentCardID }, (msg) => {
            let options = rent.getPlayOptions(card); 
            //Ask the player which property to charge rent to
            let i = 0 // the property index to charge rent to 
            params = { "card_id" : card.id, "propertySet_id" : options[i].id, "doubleRentCard_id" : doubleRentCardID }
            socket.emit("chargeRent", params, (msg) => {
                // return a list of player with id, arr of money, topOfMoneyPile, numOfCardsInHand, justSayNo
            });
        });
    }, 
    continue : function() {

    }, 

    request : function() {
        
    },

    submit : function() {

    },

    justSayNo : function() {

    },

    getPlayOptions : function(card) {
        let options = []; 
        let color1 = game.cardStats.cardStats[card.cardType][card.cardName]["color1"]; 
        let color2 = game.cardStats.cardStats[card.cardType][card.cardName]["color2"];
        for (let i = 0; i < player.propertySets.length; i++) {
            let propertySet = player.propertySets[i]; 
            if (propertySet.color == color1 || propertySet.color == color2 || color1 == "any") {
                options.push(propertySet); 
            }
        }
        return options; 
    }, 

    canPlay : function(card) {
        if (rent.getPlayOptions(card).length > 0) {
            return true; 
        }
        return false; 
    }
    
}

export default rent; 