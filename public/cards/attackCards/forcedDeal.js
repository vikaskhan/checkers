import {socket, game, player, opponents} from '../../behavior.js'; 
import utility from '../../utility.js';
import property from '../property.js';
import actionCardManager from '../../cardManager.js';
import viewManager from '../../viewManager.js';

let forcedDeal = {

    sPlayer_id : "",
    dPlayer_id : "", 
    s_property_id : "", 
    d_property_id : "", 

    play : function(card) {
        socket.emit("actionCardNotify", {"card_id" : card.id}, (msg) => {
            utility.removeIndexWithID(player.cardsInHand, card.id); 
            viewManager.clearOptions(); 
            this.showPlayOptions(); 
        });
    },  

    continue : function(dPlayer_id, s_property_id, d_property_id) {
        socket.emit("playActionCard", {cardName : "forcedDeal", dPlayer_id, s_property_id, d_property_id});
        let optionP = document.querySelector(".options"); 
        optionP.innerHTML = "Waiting for Response"; 
        forcedDeal.sPlayer_id = player.id; 
        forcedDeal.dPlayer_id = dPlayer_id; 
        forcedDeal.s_property_id = s_property_id;
        forcedDeal.d_property_id = d_property_id;
        actionCardManager.activeCard = forcedDeal; 
        actionCardManager.activeCardName = "forcedDeal"; 
    },

    request : function({sPlayer_id, dPlayer_id, s_property_id, d_property_id}) {
        this.sPlayer_id = sPlayer_id; 
        this.dPlayer_id = dPlayer_id; 
        this.s_property_id = s_property_id;
        this.d_property_id = d_property_id

        actionCardManager.activeCard = forcedDeal; 
        actionCardManager.activeCardName = "forcedDeal"; 

        viewManager.clearOptions(); 
        this.showResponseOptions(); 
        actionCardManager.justSayNoView(); 
    },

    response : function() {
        viewManager.clearOptions();
        let optionP = document.querySelector(".options"); 
        let message = document.createElement("h1");  
        message.innerHTML = "Action Card Was Successful"; 
        optionP.appendChild(message); 
    },

    forfeit : function() {
        viewManager.clearOptions();
        let optionP = document.querySelector(".options"); 
        let message = document.createElement("h1");  
        message.innerHTML = "Action Card Failed"; 
        optionP.appendChild(message); 
    }, 

    canPlay : function(card) {
        // Can play if opponent has an incomplete set and player has a card to swap
        if (player.propertySets.length == 0) 
            return false; 
        for (let id in opponents) {
            let opponent = opponents[id]; 
            if (property.getIncompleteSets(opponent).length > 0)
                return true; 
        }
        return false; 
    },

    showResponseOptions : function() {
        let button = viewManager.createSubmitButton(function() { socket.emit("respondToActionCard")}, "", "Accept", "responseButton");
        document.querySelector(".options").appendChild(button); 
    },

    showPlayOptions : function() {
        let optionP = document.querySelector(".options"); 
        optionP.innerHTML = ""; 
        let options = this.getPlayOptions();  
        for (let id in options) {
            for (let i = 0; i < options[id].length; i++) {
                for (let j = 0; j < options[id][i].properties.length; j++) {
                    let button = viewManager.createSelectionButton("P: " + options[id][i].properties[i].id, "playOption_" + id + "_" + options[id][i].properties[i].id);
                    optionP.appendChild(button); 
                }
            }
        }
    },

    getPlayOptions : function() {
        // Returns list of incomplete property sets for each player
        let options = {}; 
        for (let id in opponents) {
            let incompleteSets = property.getIncompleteSets(opponents[id]); 
            if (incompleteSets.length > 0) 
                options[id] = incompleteSets; 
        }
        options[player.id] = property.getIncompleteSets(player); 
        return options; 
    }, 

}

export default forcedDeal; 

