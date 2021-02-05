import {socket, game, player, opponents} from '../../behavior.js'; 
import utility from '../../utility.js';
import property from '../property.js';
import actionCardManager from '../../cardManager.js';
import viewManager from '../../viewManager.js';

let dealBreaker = { 
    
    sPlayer_id : "",
    dPlayer_id : "", 
    propertySet_id : "", 

    play : function(card) {
        socket.emit("actionCardNotify", {"card_id" : card.id}, (msg) => {
            utility.removeIndexWithID(player.cardsInHand, card.id); 
            viewManager.clearOptions(); 
            this.showPlayOptions(); 
        });
    }, 

    continue : function(propertySet, dPlayer_id) {
        socket.emit("playActionCard", {cardName : "dealBreaker", dPlayer_id, propertySet_id : propertySet.id });
        let optionP = document.querySelector(".options"); 
        optionP.innerHTML = "Waiting for Response"; 
        dealBreaker.sPlayer_id = player.id; 
        dealBreaker.dPlayer_id = dPlayer_id; 
        dealBreaker.propertySet_id = propertySet.id;
        actionCardManager.activeCard = dealBreaker; 
        actionCardManager.activeCardName = "dealBreaker"; 
    },

    request : function({sPlayer_id, dPlayer_id, propertySet_id}) {
        this.sPlayer_id = sPlayer_id; 
        this.dPlayer_id = dPlayer_id; 
        this.propertySet_id = propertySet_id;

        actionCardManager.activeCard = dealBreaker; 
        actionCardManager.activeCardName = "dealBreaker"; 

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
        // Can play card if an opponent has full set
        for (let id in opponents) {
            let propertySets = opponents[id].propertySets; 
            for (let i = 0; i < propertySets.length; i++) {
                if (property.isFullSet(propertySets[i]))
                    return true;
            }
        }
        return false; 
    },

    showResponseOptions : function() {
        let button = viewManager.createSubmitButton(function() { socket.emit("respondToActionCard")}, "", "Accept", "responseButton");
        document.querySelector(".options").appendChild(button); 
    },

    showPlayOptions : function() {
        let options = this.getPlayOptions();  
        let optionsP = document.querySelector(".options"); 
        for (let id in options) {
            let selection_view_id= document.createElement("div");
            selection_view_id.id = "playOptions_" + id; 
            selection_view_id.innerHTML = "<h1>Player " + id + " properties</h1>"; 
            for (let i = 0; i < options[id].length; i++) {
                let button = viewManager.createSubmitButton(dealBreaker.continue, options[id][i], "PS: " + options[id][i].id, "playOption_" + id + "_" + options[id][i].id);
                selection_view_id.appendChild(button); 
            }
            optionsP.appendChild(selection_view_id); 
        }
    },

    getPlayOptions : function() {
        // returns object of propertySets that are full sets
        let options = {}; 
        for (let id in opponents) {
            let fullSets = property.getFullSets(opponents[id]); 
            if (fullSets.length > 0) 
                options[id] = fullSets; 
        }
        return options; 
    },
}

export default dealBreaker; 
