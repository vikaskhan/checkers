const fs = require('fs'); 

fs.readFile('./game.html', (err, data) => {
    console.log(data.toString());
});

const test = () => {
    console.log("Hello"); 
}; 

