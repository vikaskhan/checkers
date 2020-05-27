//app.js
var app = require('express')();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
 
app.get("/", (req, res) => res.sendFile(__dirname + "/client/title.html"));
app.use('/client',require('express').static(__dirname + '/client'));
 
http.listen(2000);
console.log("server started");

io.on("connection", function(socket) {
    console.log("A user connected");
    socket.emit("user connected", "hello");
    socket.on("message", function(msg) {
        console.log(msg);
        socket.emit("message", "hello");
    }) 
});