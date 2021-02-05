import {socket, game, player, opponents} from '../../behavior.js'; 
import property from './property.js';

let justSayNo = { 

    // play : function(card, cardName) {
    //     socket.emit("justSayNo", {cardName, card_id : card.id});  
    // }, 

    canPlay : function(card) {
        // can't play by itself
        return false; 
    },

    // addOption : function(cardName) {
    //     for (let i = 0; i < player.cardsInHand.length; i++) {
    //         if (player.cardsInHand[i].cardName == "justSayNo") {
    //             let optionP = document.querySelector(".options"); 
    //             let button = document.createElement('button'); 
    //             button.addEventListener('click', function() { justSayNo.play(player.cardsInHand[i], cardName); })
    //             button.innerHTML = "Yes";  
    //             optionP.appendChild(button); 
    //             break; 
    //         }
    //     }
    // },

}

export default justSayNo; 