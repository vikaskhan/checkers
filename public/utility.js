
let utility = {

    shuffle : function(arr) {
        for (var i = arr.length - 1; i >= 0; i--) {
            var j = Math.floor(Math.random() * i); 
            var temp = arr[i]; 
            arr[i] = arr[j]; 
            arr[j] = temp; 
        }
    },

    getObjectIndexFromID : function(arr, id) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == id) 
                return i; 
        }
        return -1; 
    },

    removeIndexWithID : function(arr, id) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].id == id) 
                arr.splice(i, 1); 
        }
        return;
    }

}

export default utility; 