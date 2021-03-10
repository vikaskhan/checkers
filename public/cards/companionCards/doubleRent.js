import {socket, game, player, opponents} from '../../behavior.js'; 
import utility from '../../utility.js';
import property from '../propertyCards/property.js';
import actionCardManager from '../../cardManager.js';
import viewManager from '../../viewManager.js';

let doubleRent = {
    getCardLocations : function(card) {
        let cardIndexes = []; 
        for (let i = 0; i < player.cardsInHand.length; i++) {
            if (player.cardsInHand[i].cardName == "doubleRent") {
                cardIndexes.push(i);
            }
        }
        return cardIndexes; 
    },

    canPlay : function(card) {
        // Can't play by itself
        return false; 
    },
}

export default doubleRent; 