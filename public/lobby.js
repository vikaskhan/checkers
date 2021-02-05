import {socket, game, player, opponents} from './behavior.js'; 

let lobby = {

     enterLobbyAsPleb : function() {
        lobby.enterLobbyDisplay(); 
        document.getElementsByClassName("game_link")[0].setAttribute("value", "localhost:3000/?id=" +  game.id);
        socket.emit("enterLobbyAsPleb", game.id, (msg) => {
            for (let i = 0; i < msg.opponents.length; i++) {
                opponents[msg.opponents[i].id] = msg.opponents[i]; 
            }
            Object.assign(game, msg.game); 
            Object.assign(player, msg.player); 
        })
    },

    enterLobbyAsLeader : function() {
        lobby.enterLobbyDisplay(); 
        socket.emit("enterLobbyAsLeader", "", (msg) => { 
            Object.assign(game, msg.game); 
            Object.assign(player, msg.player); 
            document.getElementsByClassName("game_link")[0].setAttribute("value", "localhost:3000/?id=" +  game.id);
            document.getElementsByClassName("startGameButton")[0].removeAttribute("disabled"); 
        });
    },

    enterLobbyDisplay : function() {
        document.getElementsByClassName("start_screen")[0].style.display = "none";
        let lobby = document.getElementsByClassName("lobby")[0]; 
        lobby.style.display = "block";
    }

}

export default lobby; 

