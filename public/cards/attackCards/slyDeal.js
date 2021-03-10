import {socket, game, player, opponents} from '../../behavior.js'; 
import utility from '../../utility.js';
import property from '../propertyCards/property.js';
import actionCardManager from '../../cardManager.js';
import viewManager from '../../viewManager.js';

let slyDeal = {

    sPlayer_id : "",
    dPlayer_id : "", 
    property_id : "", 

    play : function(card) {
        socket.emit("actionCardNotify", {"card_id" : card.id}, (msg) => {
            utility.removeIndexWithID(player.cardsInHand, card.id); 
            viewManager.clearOptions(); 
            this.showPlayOptions(); 
        });
    }, 

    continue : function(property, dPlayer_id) {
        socket.emit("playActionCard", {cardName : "slyDeal", dPlayer_id, property_id : property.id });
        let optionP = document.querySelector(".options"); 
        optionP.innerHTML = "Waiting for Response"; 
        slyDeal.sPlayer_id = player.id; 
        slyDeal.dPlayer_id = dPlayer_id; 
        slyDeal.property_id = property.id;
        actionCardManager.activeCard = slyDeal; 
        actionCardManager.activeCardName = "slyDeal"; 
    },

    request : function({sPlayer_id, dPlayer_id, property_id}) {
        this.sPlayer_id = sPlayer_id; 
        this.dPlayer_id = dPlayer_id; 
        this.property_id = property_id;

        actionCardManager.activeCard = slyDeal; 
        actionCardManager.activeCardName = "slyDeal"; 

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
                    let button = viewManager.createSubmitButton(slyDeal.continue, options[id][i].properties[j], "P: " + options[id][i].properties[i].id, "playOption_" + id + "_" + options[id][i].properties[i].id);
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
        return options; 
    }, 
}

export default slyDeal; 

