import {socket, game, player, opponents} from '../../behavior.js'; 
import property from './property.js';

let hotel = {
    hotel : function(card, propertySet) {
        socket.emit("hotel", {"card" : card, "propertySet" : propertySet}, (msg) => {
    
        });
    }, 
    play : function(card) {

    }, 
    continue : function() {

    }, 

    request : function() {
        
    },

    submit : function() {

    },

    justSayNo : function() {

    },
    canPlay : function(card) {
        // Can play if player has a full set
        return property.getFullSets(player).length != 0; 
    },

    getPlayOptions : function(card) {
        // returns list of propertySets
        return property.getFullSets(player).length
    },
}

export default hotel; 

