import dealBreaker from './cards/attackCards/dealBreaker.js';
import justSayNo from './cards/companionCards/justSayNo.js';
import slyDeal from './cards/attackCards/slyDeal.js';
import forcedDeal from './cards/attackCards/forcedDeal.js';
import debtCollector from './cards/attackCards/debtCollector.js';
import itsMyBirthDay from './cards/attackCards/itsMyBirthDay.js';
import passGo from './cards/passGo.js';
import house from './cards/propertyCards/house.js';
import hotel from './cards/propertyCards/hotel.js';
import doubleRent from './cards/companionCards/doubleRent.js';
import {socket, game, player, opponents} from './behavior.js'; 
import viewManager from './viewManager.js';

let cardManager = {
    
    activeCard : "", 
    activeCardName : "", 

    play : function(card) {
        switch(card.cardName) {
            case "dealBreaker":
                dealBreaker.play(card); 
                break; 
            case "justSayNo":
                justSayNo.play(card); 
                break; 
            case "slyDeal":
                slyDeal.play(card); 
                break; 
            case "forceDeal":
                forcedDeal.play(card); 
                break; 
            case "debtCollector": 
                debtCollector.play(card); 
                break; 
            case "itsMyBirthday":
                itsMyBirthDay.play(card); 
            case "passGo":
                passGo.play(card); 
            case "house":
                house.play(card); 
                break;
            case "hotel":
                hotel.play(card); 
                break; 
            case "doubleRent":
                doubleRent.play(card); 
                break; 
        }
    }, 

    canPlay : function(card) {
        switch(card.cardName) {
            case "dealBreaker":
                return dealBreaker.canPlay(card); 
                break; 
            case "justSayNo":
                return justSayNo.canPlay(card); 
                break; 
            case "slyDeal":
                return slyDeal.canPlay(card); 
                break; 
            case "forceDeal":
                return forcedDeal.canPlay(card); 
                break; 
            case "debtCollector": 
                return debtCollector.canPlay(card); 
                break; 
            case "itsMyBirthday":
                return itsMyBirthDay.canPlay(card); 
            case "passGo":
                return passGo.canPlay(card); 
            case "house":
                return house.canPlay(card); 
                break;
            case "hotel":
                return hotel.canPlay(card); 
                break; 
            case "doubleRent":
                return doubleRent.canPlay(card); 
                break; 
        }
        return false; 
    },

    request : function(msg) {
        switch(msg.cardName) {
            case "dealBreaker":
                return dealBreaker.request(msg); 
                break; 
            case "justSayNo":
                return justSayNo.request(msg); 
                break; 
            case "slyDeal":
                return slyDeal.request(msg); 
                break; 
            case "forceDeal":
                return forcedDeal.request(msg); 
                break; 
            case "debtCollector": 
                return debtCollector.request(msg); 
                break; 
            case "itsMyBirthday":
                return itsMyBirthDay.request(msg); 
            case "passGo":
                return passGo.request(msg); 
            case "house":
                return house.request(msg); 
                break;
            case "hotel":
                return hotel.request(msg); 
                break; 
            case "doubleRent":
                return doubleRent.request(msg); 
                break; 
        }
        return false; 
    },

    response : function(msg) {
        this.activeCard.response(msg); 
    },

    forfeit : function(msg) {
        this.activeCard.forfeit(msg); 
    },

    justSayNo : function({sender, receiver}) {
        let optionP = document.querySelector(".options"); 
        let message = document.createElement("h1"); 
        message.innerHTML = "Oh No! " + sender + " counteracted with a Just Say No Card"; 
        optionP.appendChild(message); 
        if (receiver == player.id) {
            if (player.id == this.activeCard.sPlayer_id)
                optionP.appendChild(viewManager.createSubmitButton( function() { socket.emit("actionCardForfeit", {sender, receiver}) }, "", "Surrender", "forfeitButton")); 
            else {
                this.activeCard.showResponseOptions(); 
            }
            let justSayNoCardsInHand = this.getCards("justSayNo"); 
            if (justSayNoCardsInHand.length > 0) {
                optionP.appendChild(viewManager.createSubmitButton( function() { socket.emit("justSayNo", { card_id : justSayNoCardsInHand[0].id, receiver : sender}); }, "", "Just Say No", "justSayNoButton")); 
            }
        }
    },

    getCards : function(cardName) {
        let cards = []; 
        for (let i = 0; i < player.cardsInHand.length; i++) {
            if (player.cardsInHand[i].cardName == cardName)
                cards.push(player.cardsInHand[i]);
        }
        return cards; 
    }, 

    justSayNoView : function() {
        let justSayNoCardsInHand = actionCardManager.getCards("justSayNo"); 
        if (justSayNoCardsInHand.length > 0) {
            optionP.appendChild(viewManager.createSubmitButton( function() { socket.emit("justSayNo", { card_id : justSayNoCardsInHand[0].id, receiver : activeCard.sPlayer_id }); }, "", "Just Say No", "justSayNoButton")); 
        }
    }

}

export default cardManager; 