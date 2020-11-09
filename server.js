const express = require('express');
const app = express(); 
const http = require('http').createServer(app)
const PORT = process.env.PORT || 3000

const users = {};
var countClients = 0 ;
var usernames = [] ;
var connections = [];

http.listen(PORT, () => 
{
    console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname + "/utils"));
app.get('/',(request,response) =>
{
    response.sendFile(__dirname + "/utils/index.html");
});

const io = require('socket.io')(http)
io.on('connection', socket =>
{
    //check if the connection is successful 
    console.log("Connection Success..."); 
    // countClients++;
    connections.push(socket);
    console.log("Connected : %s sockets are connected", connections.length);

    //when new user connected
    socket.on('new-user', user_name => 
    {
        usernames.push(user_name);
        
        // socket.broadcast.emit('count updated', usernames.length); 
        updateUserNames();


        users[socket.id] = user_name

        console.log(user_name + " joins");
        console.log("Current Active users :-" + usernames);
        // console.log(countClients + " User(s) Online"); 

        socket.broadcast.emit('user-connected', user_name);

        // usernames.push(user_name);
		// updateUserNames();

    });

    function updateUserNames(){
		io.sockets.emit('usernames',usernames); //Broadcast concept 
	}
    //when user send message, server then broadcasted it those who are connected
    socket.on("message", (msg) =>
    {
        console.log(msg);
        socket.broadcast.emit("message", msg); // multicast concept 

    });

    //when user send the image, server then bradcasted it those who are connected
    socket.on("image", (imgData) =>
    {
        console.log("broadcasting image...");
        socket.broadcast.emit("image",imgData);
    });    
    
    //when user left from the server, server let them know that user left
    socket.on('disconnect', () => 
    {
        
        // if(!users[socket.id]){
		// 	return;
        // }
        usernames.splice(usernames.indexOf(users[socket.id]), 1);
        // updateUserNames();

        connections.splice(connections.indexOf(socket), 1);
        console.log("Connected : %s sockets are connected", connections.length);
        updateUserNames();

        console.log(users[socket.id] + " left");
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        // delete users[socket.id];
        // updateUserNames();

        console.log("Current Active users :-" + usernames);
        // console.log(`${--countClients} User(s) Online`); 
        // socket.emit('count updated', usernames.length); 


      });
});

