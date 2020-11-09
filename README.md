# Real Time Chat-Application
The aim of this lab is to create a collaborative chat for multiple users with the help of using node.js (using packages like socket.io for managing websockets and express for deploying the server) and basic HTML and javascript (using DOM HTML) for the client side.

## Server Side 
It is implemented in node.js, socket.io and express which handles the messages concurrently. 
Responsible for the following objectives:-
* When a user joins the chat, he/she is greeted.
* All connected users are notified who enters the chat room.
* Users can broadcast the message.
* List of the active users are shown. 

## Client Side 
It communicates with the server by sending messages to the server and listening for notifications.<br/>

For UI :- The html file is used to build the structure of the websites and its contents. 
The CSS file is here to make the web page more user friendly and good looking which will improve the user experience.

For Chat Script :- Implemented in basic DOM HTML 

## Features 
* Multiple users can chat together in real-time. 
* Users can join and leave if they wish. 
* All users will get notified when the user joins or leaves the current chat.
* The list of active users are provided. 
* Concept of unicast, multicast and broadcast is provided. 
* The user can send both text as well as images. 
* The user can send the voice message too.

# Installations 
-------------------------------------
Make sure you have Node.js and npm install.

1. Clone or Download the repository

        git clone https://github.com/dibyenducoder/Chat-Application-.git
        $ cd Chat-Application
 
2. Install Dependencies 

        npm install
  
3. Start the Application
       
       node server.js
