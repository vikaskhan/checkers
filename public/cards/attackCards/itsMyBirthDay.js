import {socket, game, player, opponents} from '../../behavior.js'; 
import utility from '../../utility.js';
import property from '../propertyCards/property.js';
import actionCardManager from '../../cardManager.js';
import viewManager from '../../viewManager.js';

let itsMyBirthDay = {

    sPlayer_id : "",

    play : function(card) {
        socket.emit("playActionCard", {cardName : "debtCollector", "card_id" : card.id});
        utility.removeIndexWithID(player.cardsInHand, card.id); 
        viewManager.clearOptions();  
        let optionP = document.querySelector(".options"); 
        optionP.innerHTML = "Waiting for Response"; 
        itsMyBirthDay.sPlayer_id = player.id; 
        actionCardManager.activeCard = itsMyBirthDay; 
        actionCardManager.activeCardName = "itsMyBirthday"; 
    }, 

    request : function({sPlayer_id}) {
        this.sPlayer_id = sPlayer_id; 
        
        actionCardManager.activeCard = itsMyBirthDay; 
        actionCardManager.activeCardName = "itsMyBirthDay";

        viewManager.clearOptions(); 
        this.showResponseOptions(); 
        actionCardManager.justSayNoView(); 
    },

    response : function({opponent_id, money, properties}) {
        console.log(money); 
        console.log(properties); 
        // let totalMoney = 0;
        // for (let i = 0; i < money.length; i++) {
        //     let card = money[i]; 
        //     totalMoney += game.getCardValue(card); 
        // }
        // if (this.sPlayer_id == player.id) {
        //     player.totalMoney += totalMoney; 
        //     for (let i = 0; i < money.length; i++) {
        //         player.cardsInHand.push(money[i]); 
        //     }
        // }
        // else {
        //     opponents[this.sPlayer_id].totalMoney += money; 
        // }
        
    }, 

    forfeit : function({opponent_id}) {
        viewManager.clearOptions();
        let optionP = document.querySelector(".options"); 
        let message = document.createElement("h1");  
        message.innerHTML = "Action Card Failed"; 
        optionP.appendChild(message);
    },

    canPlay : function(card) {
        // Can always play debt collector
        return true; 
    },

    showResponseOptions : function() {
        let optionP = document.querySelector(".options");
        for (let i = 0; i < player.moneyPile.length; i++) {
            let card = player.moneyPile[i]; 
            let button = viewManager.createSelectionButton(card.cardName + "-" + game.getCardValue(card), "m" + i); 
            optionP.appendChild(button); 
        }
        for (let i = 0; i < player.propertySets.length; i++) {
            for (let j = 0; j < player.propertySets[i].properties.length; j++) {
                let card = player.propertySets[i].properties[j];
                let button = viewManager.createSelectionButton(card.cardName + "-" + game.getCardValue(card), "p" + i); 
                optionP.appendChild(button); 
            }
        }
    },
}

export default itsMyBirthDay; 