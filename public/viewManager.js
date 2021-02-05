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
    }

}

export default viewManager; 
