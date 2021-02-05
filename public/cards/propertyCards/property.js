import {socket, game, player, opponents} from '../behavior.js'; 
import utility from '../utility.js';

let property = {
    add : function(card, propertySet, color) {
        socket.emit("placePropertyCard", {"card_id" : card.id, "propertySet_id" : property.getID(propertySet), "color" : color}, (msg) => {
            utility.removeIndexWithID(player.cardsInHand, card.id); 
            player.movesRemaining = msg.movesRemaining; 
            if (propertySet == -1) 
                player.propertySets.push(msg.propertySet); 
            else
                propertySet.properties.push(card); 
        })
    }, 

    move : function(card, source, destination, color) {
        socket.emit("movePropertyCard", {"card_id" : card.id, "sourcePropertySet_id" : source.id, "destinationPropertySet_id" : property.getID(destination), "color" : color }, (msg) => {
            utility.removeIndexWithID(player.cardsInHand, card.id);
            player.movesRemaining = msg.movesRemaining; 
            utility.removeIndexWithID(source.properties, card.id); 
            if (source.properties.length == 0) 
                utility.removeIndexWithID(player.propertySets, source.id); 
            if (destination == -1)
                player.propertySets.push(msg.destinationPropertySet); 
            else
                destination.properties.push(card);
        });
    },
 
    getAddOptions : function(card) { 
        let options = []; 
        let color1, color2; 
        if (card.cardType == "propertyCards") {
            color1 = game.cardStats.cardStats[card.cardType][card.cardName]["color"]; 
            color2 = color1; 
        }
        else {
            color1 = game.cardStats.cardStats[card.cardType][card.cardName]["color1"];
            color2 = game.cardStats.cardStats[card.cardType][card.cardName]["color2"];
        }
        for (let i = 0; i < player.propertySets.length; i++) {
            let propertySet = player.propertySets[i]; 
            let fullSet = game.cardStats.propertyColors[propertySet.color].fullSet; 
            if (propertySet.properties.length < fullSet && (propertySet.color == color1 || propertySet.color == color2 || color1 == "any"))
                options.push(propertySet); 
        }
        return options; 
    },

    getMoveOptions : function(card, source) {
        let options = []; 
        let color1, color2; 
        if (card.cardType == "propertyCards") {
            color1 = game.cardStats.cardStats[card.cardType][card.cardName]["color"]; 
            color2 = color1; 
        }
        else {
            color1 = game.cardStats.cardStats[card.cardType][card.cardName]["color1"];
            color2 = game.cardStats.cardStats[card.cardType][card.cardName]["color2"];
        }
        for (let i = 0;i < player.propertySets.length; i++) {
            let propertySet = player.propertySets[i]; 
            if (propertySet.id == source.id)
                continue; 
            let fullSet = game.cardStats.propertyColors[propertySet.color].fullSet; 
            if (propertySet.properties.length < fullSet && (propertySet.color == color1 || propertySet.color == color2 || color1 == "any"))
                options.push(propertySet); 
        }
        return options; 
    },

    getID : function(set) {
        if (set == -1) 
            return -1; 
        return set.id; 
    },

    getFullSets : function(player) {
        let fullSets = []; 
        let sets = player.propertySets; 
        for (let i = 0; i < sets.length; i++) {
            let set = sets[i]; 
            if (this.isFullSet(set))
                fullSets.push(set); 
        }
        return fullSets;
    },

    getIncompleteSets : function(player) {
        let incompleteSets = []; 
        let sets = player.propertySets; 
        for (let i = 0; i < sets.length; i++) {
            let set = sets[i]; 
            if (!this.isFullSet(set))
                incompleteSets.push(set); 
        }    
        return incompleteSets;     
    },

    isFullSet : function(set) {
        return game.cardStats.propertyColors[set.color].fullSet == set.properties.length;
    }

}

export default property; 

