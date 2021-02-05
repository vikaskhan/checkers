import {socket, game, player, opponents} from './behavior.js'; 

let playerActions = {

    startGame : function() {
        socket.emit("startGame", game.id);
    },
    
    drawCards : function() {
        socket.emit("drawCards", "", (cards) => {
            for (let i = 0; i < cards.length; i++) {
                player.cardsInHand.push(cards[i]); 
                player.numCardsInHand++; 
            }
        }); 
    },
    
    endTurn : function () {
        socket.emit("endTurn", player.id);
    }

}

export default playerActions; 




