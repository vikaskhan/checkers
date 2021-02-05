import {socket, game, player, opponents} from '../behavior.js'; 
import utility from '../utility.js';
import property from './property.js';
import actionCardManager from '../cardManager.js';
import viewManager from '../viewManager.js';

let passGo = {

    play : function(card) {
        socket.emit("passGo", {cardName : "passGo", card_id : card.id});
        utility.removeIndexWithID(player.cardsInHand, card.id); 
        viewManager.clearOptions(); 
    }, 

    request : function() {
        // Trigger view to show opponnent draw 2 cards
    }, 

    response : function() {

    }, 

    canPlay : function(card) {
        // can always play
        return true; 
    },
    
}

export default passGo; 
