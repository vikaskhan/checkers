import {socket, game, player, opponents} from '../../behavior.js'; 
import utility from '../../utility.js';
import property from '../property.js';
import actionCardManager from '../../cardManager.js';
import viewManager from '../../viewManager.js';

let debtCollector = {

    sPlayer_id : "",
    dPlayer_id :  "", 

    play : function(card) {
        socket.emit("actionCardNotify", {"card_id" : card.id}, (msg) => {
            utility.removeIndexWithID(player.cardsInHand, card.id); 
            viewManager.clearOptions(); 
            this.showPlayOptions(); 
        });
    }, 

    continue : function(dPlayer_id) {
        socket.emit("playActionCard", {cardName : "debtCollector", dPlayer_id});
        let optionP = document.querySelector(".options"); 
        optionP.innerHTML = "Waiting for Response"; 
        debtCollector.sPlayer_id = player.id; 
        debtCollector.dPlayer_id = dPlayer_id; 
        actionCardManager.activeCard = debtCollector; 
        actionCardManager.activeCardName = "debtCollector"; 
    },

    request : function({sPlayer_id, dPlayer_id}) {
        this.sPlayer_id = sPlayer_id; 
        this.dPlayer_id = dPlayer_id; 
       
        actionCardManager.activeCard = debtCollector; 
        actionCardManager.activeCardName = "debtCollector"; 

        viewManager.clearOptions(); 
        this.showResponseOptions(); 
        actionCardManager.justSayNoView(); 
    },

    response : function({money, properties}) {
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

    forfeit : function() {
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

    showPlayOptions : function() {
        let optionsP = document.querySelector(".options"); 
        for (let id in opponents) {
            let button = viewManager.createSubmitButton(debtCollector.continue, id, id, "playOption_" + id);
            optionsP.appendChild(button); 
        }
    }, 

}

export default debtCollector; 
