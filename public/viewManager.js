let viewManager = {

    createSubmitButton : function(functionName, params, buttonText, id) {
        let button = document.createElement('button');
        button.innerHTML = buttonText; 
        button.id = id; 
        button.addEventListener('click', function() { functionName(params); })
        return button; 
    },

    createSelectionButton : function(buttonText, id) {
        let button = document.createElement('button'); 
        button.id = id; 
        button.innerHTML = buttonText; 
        button.addEventListener('click', function() { 
            if (button.style.borderColor != "blue") 
                button.style.borderColor = "blue"; 
            else 
                button.style.borderColor = "black"; 
        });
        return button; 
    }, 

    clearOptions : function() {
        document.querySelector(".options").innerHTML = ""; 
    }, 

    drawCard : function() {
        let gameView = document.querySelector(".game"); 
        let newCard = document.createElement("img"); 
        newCard.src = "./testCard.png"; 
        let player_hand = document.querySelector(".player_hand");
        newCard.classList.add("transition");
        gameView.appendChild(newCard); 

        setTimeout(function() {
            newCard.style.bottom = "0%";
        }, 1000);
        


        // player_hand.appendChild(newCard);
        // newCard.style.bottom = "50%"
        //newCard.classList.add("cardInHand");
        
        
        
        
        
        
        // // newCard.style.position = "fixed"; 
        // // newCard.style.bottom = "50%"; 
        // // newCard.style.left = "50%"; 
        // 
        // player_hand.appendChild(newCard); 
    }

}

export default viewManager; 
