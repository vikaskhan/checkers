import lobby from './lobby.js'; 
import playerActions from './playerActions.js';
import socketReceiver from './socketReceiver.js'; 
import money from './cards/money.js'; 
import property from "./cards/propertyCards/property.js";
import rent from "./cards/attackCards/rent.js";
import actionCardManager from './cardManager.js'; 


export let socket = io();
export let game = {
    getCardValue : function(card) {
        if (card.cardType != "propertyCards")
            return this.cardStats.cardStats[card.cardType][card.cardName]["value"];
        let color = this.cardStats.cardStats[card.cardType][card.cardName]["color"];
        return this.cardStats.propertyColors["color"]["value"]; 
    }
}; 
export let player = {}; 
export let opponents = {}; 

socketReceiver(); 

function initialize() {
    document.querySelector('.enterLobbyButton').addEventListener('click', lobby.enterLobbyAsLeader);
    document.querySelector('.copy').addEventListener('click', copyID);
    document.querySelector('.startGameButton').addEventListener('click', playerActions.startGame);
    document.querySelector('.endTurn').addEventListener('click', playerActions.endTurn);
    document.querySelector('.drawCards').addEventListener('click', playerActions.drawCards);
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    game.id = urlParams.get('id'); 
    if(game.id != null)
        lobby.enterLobbyAsPleb(); 
}

document.getElementsByClassName('debug_text')[0].onkeydown = function(event) {
    if (event.keyCode == 13) {
        var val = document.getElementsByClassName("debug_text")[0].value;
        money.add(val.split(" ")); 
        document.getElementsByClassName("debug_text")[0].value = "";
    }
}

// function getPlayer(id) {
//     for (let i = 0; i < players.length; i++) {
//         if (players[i].id == id) 
//             return players[i]; 
//     }
//     return -1;
// }

function copyID() {
    var link = document.getElementsByClassName("game_link")[0]; 
    link.select();
    link.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

export function update() {
    // let playerHandDiv = document.querySelector(".player_hand"); 
    // playerHandDiv.style.left = playerHandDiv.style.left + 35 + '%'; 
    // let cardUL = document.getElementsByClassName("cards")[0];
    // let propertyUL = document.getElementsByClassName("properties")[0]
    // let totalMoney = document.querySelector(".totalMoney"); 
    // let moneyPile = document.querySelector(".money"); 
    // let opponentP = document.querySelector(".opponent"); 
    // cardUL.innerHTML = ""; 
    // propertyUL.innerHTML = ""; 

    // let cards = player.cardsInHand; 
    // let propertySets = player.propertySets;

    // totalMoney.innerHTML = "Total Money: " + player.totalMoneyPile; 
    // moneyPile.innerHTML = "Cards in Money Pile: " + JSON.stringify(player.moneyPile);
    // opponentP.innerHTML = JSON.stringify(opponents); 

    // for (let i = 0; i < cards.length; i++) {
    //     let card = cards[i]; 
    //     let li = document.createElement('li'); 
    //     li.innerHTML = JSON.stringify(cards[i]);  
    //     if (money.canAdd(cards[i])) {
    //         let button = document.createElement('button');
    //         button.setAttribute('ID', card.id);
    //         button.addEventListener('click', function() { money.add(card)} );
    //         button.innerHTML = "Add To Money";
    //         li.appendChild(button);   
    //     }
    //     if (card.cardType == "propertyCards" || card.cardType == "wildcards") { 
    //         let options = property.getAddOptions(card); //should return a list of property sets
    //         for (let j = 0; j < options.length; j++) {
    //             let button = document.createElement('button'); 
    //             button.setAttribute('ID', card.id); 
    //             button.addEventListener('click', function() { property.add(card, options[j], options.color) })
    //             button.innerHTML = "Add to property set " + options[j].id; 
    //             li.appendChild(button); 
    //         }
    //         if (card.cardType == "propertyCards") {
    //             let button = document.createElement('button');
    //             button.setAttribute('ID', card.id); 
    //             button.addEventListener('click', function() { property.add(card, -1, game.cardStats.cardStats[card.cardType][card.cardName]["color"]) })
    //             button.innerHTML = "Create new property set " + game.cardStats.cardStats[card.cardType][card.cardName]["color"]; 
    //             li.appendChild(button); 
    //         }
    //         else {
    //             if (card.cardName == "multi") continue; 
    //             let button = document.createElement('button');
    //             button.setAttribute('ID', card.id); 
    //             button.addEventListener('click', function() { property.add(card, -1, game.cardStats.cardStats[card.cardType][card.cardName]["color1"]) })
    //             button.innerHTML = "Create new property set " + game.cardStats.cardStats[card.cardType][card.cardName]["color1"]; 
    //             li.appendChild(button); 

    //             button = document.createElement('button');
    //             button.setAttribute('ID', card.id); 
    //             button.addEventListener('click', function() { property.add(card, -1, game.cardStats.cardStats[card.cardType][card.cardName]["color2"]) })
    //             button.innerHTML = "Create new property set " + game.cardStats.cardStats[card.cardType][card.cardName]["color2"]; 
    //             li.appendChild(button); 
    //         }
    //     }
    //     if (card.cardType == "actionCards" && actionCardManager.canPlay(card)) {
    //         let button = document.createElement('button'); 
    //         button.setAttribute('ID', card.id); 
    //         button.addEventListener('click', function() { actionCardManager.play(card) } );
    //         button.innerHTML = "Play card " + card.id; 
    //         li.appendChild(button); 
    //     }
    //     if (card.cardType == "rentCards" && rent.canPlay(card)) {
    //         let button = document.createElement('button'); 
    //         button.setAttribute('ID', card.id); 
    //         button.addEventListener('click', function() { rent.play(card) } );
    //         button.innerHTML = "Charge rent"; 
    //         li.appendChild(button);                
    //     }
    //     li.setAttribute('style', 'display: block;'); 
    //     cardUL.appendChild(li); 
    // }

    // for (let i = 0; i < propertySets.length; i++) {
    //     let propertySet = propertySets[i]; 
    //     let li = document.createElement('li'); 
    //     li.innerHTML = JSON.stringify(propertySets[i]); 
    //     for (let j = 0; j <propertySet.properties.length; j++) {
    //         let card = propertySet.properties[j]; 
    //         let options = property.getMoveOptions(card, propertySet); 
    //         for (let k = 0; k < options.length; k++) {
    //             let button = document.createElement('button'); 
    //             button.setAttribute('ID', propertySet.id); 
    //             button.addEventListener('click', function() { property.move(card, propertySet, options[k], options[k].color) } );
    //             button.innerHTML = "Move property to " + options[k].id; 
    //             li.appendChild(button);                 
    //         }
    //     }
    //     li.setAttribute('style', 'display: block;'); 
    //     propertyUL.appendChild(li); 
    // }

}




initialize(); 