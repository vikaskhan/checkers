import {socket, game, player, opponents, update } from './behavior.js'; 
import utility from './utility.js';
import actionCardManager from './cardManager.js'; 

let intervalID; 

export default function socketReceiver() {

    socket.on("startGame", (msg) => {
        console.log("Game has started"); 
        document.getElementsByClassName("game")[0].style.display = "block"; 
        game.turn = msg.turn;
        if (game.turn == player.id) 
            console.log("It's your turn"); 
        else
            console.log("It's " + game.turn + " turn");
        intervalID = window.setInterval(update, 1000);
    })
    
    socket.on("dealCards", (cards) => {
         
        dealCards(cards); 
        createPropertyStorage();
    })

    async function dealCards(cards) {

        player.cardsInHand = cards; 
        player.numCardsInHand = cards.length; 

        let flipCards = []; 
        let W = window.innerWidth; 
        let H = window.innerHeight; 
        let w = 50; 

        let dummyElement = document.createElement("div")
        dummyElement.classList.add("flip-card");
        document.querySelector(".game").appendChild(dummyElement); 
        let card_width = parseInt(getComputedStyle(dummyElement).width, 10); 
        let card_height = parseInt(getComputedStyle(dummyElement).height, 10); 

        for (let i = 0; i < player.cardsInHand.length; i++) {

            let flipCard = createFlipCard("./deck.png", "./testCard.png");
            document.querySelector(".player_hand").appendChild(flipCard); 

            flipCard.style.bottom = (H/2)-(card_height/2) + "px"; 
            flipCard.style.left = (W/2)-(card_width/2) + "px"; 
            flipCards.push(flipCard);

            await new Promise(r => setTimeout(r, 1000));

            for (let j = 0; j < flipCards.length-1; j++) {
                flipCards[j].style.left = parseInt(flipCards[j].style.left, 10) - w + "px"; 
            }
            flipCard.style.bottom = '5px'; 
            let left = (W/2) - (w/2) + (w*flipCards.length) + "px";
            flipCard.style.left = (W/2) - (w/2) + (w*(flipCards.length-1)) + "px";
            flipCard.querySelector(".flip-card-inner").classList.add("flip-card-inner-flip");

            flipCard.addEventListener('mousedown', downListener); 
            flipCard.addEventListener('mousemove', moveListener); 
            flipCard.addEventListener('mouseup', upListener); 
            flipCard.addEventListener('mouseover', mouseOver);

        }
        let opponentsArr = Object.keys(opponents); 
        for (let i = 0; i < opponentsArr.length; i++) {

            let opponent_hand_div = document.createElement("div"); 
            opponent_hand_div.id = "opponent_" + i + "_hand"; 
            document.querySelector(".game").appendChild(opponent_hand_div); 

            flipCards = []; 
            for (let j = 0; j < player.cardsInHand.length; j++) {
                let flipCard = createFlipCard("./deck.png", "./testCard.png");
                
                document.querySelector("#opponent_" + i + "_hand").appendChild(flipCard); 
    
                // flipCard.style.bottom = (H/2)-(card_height/2) + "px"; 
                // flipCard.style.left = (W/2)-(card_width/2) + "px"; 
                flipCard.style.bottom = "50%"; 
                flipCard.style.left = "50%"; 
                flipCards.push(flipCard);
    
                await new Promise(r => setTimeout(r, 1000));

                if (i == 0) {
                    for (let k = 0; k < flipCards.length-1; k++) {
                        flipCards[k].style.left = parseInt(flipCards[k].style.left, 10) - w + "px"; 
                    }
                    flipCard.style.bottom = H - (140) - 5  + 'px'; 
                    flipCard.style.left = (W/2) - (w/2) + (w*(flipCards.length-1)) + "px";
                    flipCard.querySelector(".flip-card-inner").classList.add("flip-card-inner-rotate-counterclockwise-180");
                }
                if (i == 1) {
                    for (let k = 0; k < flipCards.length-1; k++) {
                        flipCards[k].style.bottom = parseInt(flipCards[k].style.bottom, 10) - w + "px"; 
                    }
                    flipCard.style.bottom = (H/2) - (w/2) + (w*(flipCards.length-1)) + "px"; 
                    flipCard.style.left = (card_height/2) + 5 + 'px';
                    flipCard.querySelector(".flip-card-inner").classList.add("flip-card-inner-rotate-clockwise-90");
                }
                if (i == 2) {
                    for (let k = 0; k < flipCards.length-1; k++) {
                        flipCards[k].style.bottom = parseInt(flipCards[k].style.bottom, 10) - w + "px"; 
                    }
                    flipCard.style.bottom = (H/2) - (w/2) + (w*(flipCards.length-1)) + "px"; 
                    flipCard.style.left = W - card_height - 5 + 'px';
                    flipCard.querySelector(".flip-card-inner").classList.add("flip-card-inner-rotate-counterclockwise-90");
                }
            }
        }

        
        
    }

    function downListener() {
        console.log("down"); 
    }

    function upListener() {
        console.log("up"); 
    }

    function moveListener() {
        console.log("move"); 
    }

    function mouseOver() {
        console.log("hover"); 
    }

    function createFlipCard(frontImg, backImg) {

        let flipCard = document.createElement("div"); 
        flipCard.classList.add("flip-card"); 
        flipCard.setAttribute("draggable", true);

        let flipCardInner = document.createElement("div"); 
        flipCardInner.classList.add("flip-card-inner"); 

        let flipCardFront = document.createElement("div"); 
        flipCardFront.classList.add("flip-card-front"); 

        let flipCardFrontImg = document.createElement("img"); 
        flipCardFrontImg.src = "./deck.png"; 
        flipCardFrontImg.classList.add("cardImg"); 

        flipCardFront.appendChild(flipCardFrontImg); 

        let flipCardBack = document.createElement("div"); 
        flipCardBack.classList.add("flip-card-back"); 

        let flipCardBackImg = document.createElement("img"); 
        flipCardBackImg.src = "./testCard.png"; 
        flipCardBackImg.classList.add("cardImg"); 

        flipCardBack.appendChild(flipCardBackImg); 

        flipCardInner.appendChild(flipCardFront); 
        flipCardInner.appendChild(flipCardBack); 
        
        flipCard.appendChild(flipCardInner);

        return flipCard; 

    }

    function createPropertyStorage() {
        let div = document.createElement("div"); 
        div.id = "player-properties"; 
        div.style.width = "300px"; 
        div.style.height = "150px"; 
        div.style.position = "fixed"; 
        div.style.top = "60%"; 
        div.style.left = "40%"; 
        
        let border_div = document.createElement("div"); 
        border_div.classList.add("property-border"); 

        div.appendChild(border_div); 

        document.querySelector(".game").appendChild(div); 

        let flipCard = document.querySelector(".flip-card"); 
        flipCard.style.position = "absolute"; 
        div.appendChild(flipCard); 
        
    }


    
    socket.on("addPlayer", (player) => {
        opponents[player.id] = player; 
        console.log("New Player Has Joined The Lobby: id= " + player.id); 
    })
    
    socket.on("opponentDrawCards", (id) => {
        let opponent = opponents[id]; 
        opponent.numCardsInHand += 2; 
        console.log(opponent.id + " drew 2 cards");
    })
    
    socket.on("removePlayer", (card) => {
    
    })
    
    socket.on("opponentAddToMoneyPile", (msg) => {
        console.log("Opponent Added Money to Pile");
        let opponent = opponents[msg.opponent_id]; 
        opponent.movesRemaining = msg.movesRemaining; 
        opponent.topOfMoneyPile = msg.topOfMoneyPile; 
        opponent.totalMoneyPile = msg.totalMoneyPile; 
    })
    
    socket.on("opponentPlacePropertyCard", (msg) => {
        console.log("Opponent Placed Property Card");
        let opponent = opponents[msg.opponent_id]; 
        opponent.movesRemaining = msg.movesRemaining; 
        let propertySetIndex = utility.getObjectIndexFromID(msg.propertySet, msg.propertySet.id);
        if (propertySetIndex == -1) 
            opponent.propertySets.push(msg.propertySet); 
        else
            opponent.propertySets[propertySetIndex].properties.push(msg.card); 
    })

    socket.on("oppponentMovePropertyCard", (msg) => {
        console.log("Opponent Moved Property Card");
        let opponent = opponents[msg.opponent_id]; 
        let card = msg.card; 
        let source = opponent.getObjectIndexFromID(opponent.propertySets, msg.sourcePropertySet.id); 
        let destination = opponent.getObjectIndexFromID(opponent.propertySets, msg.destinationPropertySet.id);; 
        opponent.movesRemaining = msg.movesRemaining; 
        utility.removeIndexWithID(source.properties, card.id); 
        if (source.properties.length == 0) 
            utility.removeIndexWithID(opponent.propertySets, source.id); 
        if (destination == -1)
            player.propertySets.push(msg.destinationPropertySet); 
        else
            destination.properties.push(card);
    })

    socket.on("opponentActionCardNotify", ({cardType, opponent_id}) => {
        let opponent = opponents[opponent_id]; 
        console.log("Opponent " + opponent_id + " placed a(n) " + cardType );
    })

    socket.on("opponentActionCardPlay", (msg) => {
        actionCardManager.request(msg); 
    })

    socket.on("opponentActionCardResponse", (msg) => {
        actionCardManager.response(msg); 
    })

    socket.on("opponentActionCardForfeit", (msg) => {
        actionCardManager.forfeit(msg); 
    })

    socket.on("justSayNo", (msg) => {
        actionCardManager.justSayNo(msg); 
    }) 
}

