const socket = io()

let user_name ;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.msg_area')
// let userArea = document.querySelector('#users')
var $users = $('#users') 
let sendImage = document.querySelector('#sendImage')
let sendBtn = document.querySelector('#sendBtn')

//Enter user name 
do
{
    user_name = prompt("Enter your username");
}while(!user_name);


appendMessage('You joined the JUTalkies....Share your idea!');
socket.emit('new-user', user_name); //send to the server to broadcast your name 
// addToUsersBox(user_name);
document.title = 'JUTalkie | ' + user_name ; //title of the website 

//After broadcasting, those who are coonected will be able to see 
socket.on('user-connected', user_name => {
    appendMessage(`${user_name} connected... Say Hi :)`) //other users will be able to see this

});

//if user left, other users will know whether that user left from the server 
socket.on('user-disconnected', user_name => {
    appendMessage(`${user_name} left the fun...`) //only for those who are coonected to see this message
});

// socket.on('count updated', count => {
//     //Worked on the current tab, didn't updating on the other tabs
//     document.getElementById("counter").textContent = count + (count > 1 ? ' users' : ' user') + ' online'; 
// });

socket.on('usernames',data =>
{
    // let divMain = document.createElement("li");
    var listName="";

    for(i=0;i<data.length;i++)
    {
        listName += '<li class="list-group-item">'+ data[i]+'</li>' ;
    }
    // divMain.innerHTML = html ;
    // document.getElementById("users").appendChild(listName);
    $users.html(listName);
});

//for enter key to send message
textarea.addEventListener('keyup', (e) =>
{
    if(e.key == "Enter") //Enter value 
        sndMsg(e.target.value); //message send function
});

//send button click function to send textarea message 
sendBtn.addEventListener('click' ,() =>
{
    var messageInput = document.getElementById('textarea'),
    msg = messageInput.value;
                
    messageInput.value = ''; 
    messageInput.focus();
    if (msg.trim().length != 0) //if message has some value, then send message
    {
        sndMsg(msg);    
    };
}, false );

//send message 
function sndMsg(message)
{
    let msg = {
        user: user_name, 
        message: message.trim()
    }
    appendMsg(msg, 'out'); //outgoing text message 
    textarea.value = ""; //after sending, textarea becomes null/cleared
    autoScrollDown(); //scrolling will be done automatically

    socket.emit("message", msg) //send message to the server to broadcast 
                                //so that other users can see the message 
}

//message in the message area(Chat area) 
function appendMsg(msg, type) 
{
    let divMain = document.createElement("div");
    let className = type ;
    divMain.classList.add(className, "msg"); 

    let sending =
    ` <h4>${msg.user}</h4>
      <p>${msg.message}</p>`
    
    divMain.innerHTML = sending;
    messageArea.appendChild(divMain);
}

//send image function onchange 
sendImage.addEventListener('change', () =>
{

    var filesSelected = document.getElementById("sendImage").files;
    if (filesSelected.length > 0) {
      var fileToLoad = filesSelected[0];

      var fileReader = new FileReader();

      fileReader.onload = function(fileLoadedEvent) {
        
        var srcData = fileLoadedEvent.target.result; //  data: base64
        
        var newImage = document.createElement('img');
        newImage.src = srcData;

        let imgData = {
            user: user_name, 
            message: srcData
        }

        displayImage( `${user_name}` , srcData); //display image in the message area 

        socket.emit('image',imgData); //send image to the server to broadcast it so that users can see image
      }
      fileReader.readAsDataURL(fileToLoad);
    }
  });

  //display image in the message area
  function displayImage(user , srcData ) {
    var newImage = document.createElement('img');
        newImage.src = srcData;
    
        // document.getElementById("historyMsg").innerHTML = user + newImage.outerHTML;
        
        messageArea.append(newImage);
        appendMessage(`${user} send image...`);
        autoScrollDown();
        // alert("Converted Base64 version is " + document.getElementById("historyMsg").innerHTML);

};

//incoming text message 
socket.on("message", (msg) =>
{
    appendMsg(msg, 'in');
    autoScrollDown();
});

//incoming image message 
socket.on("image", (imgData) =>
{
    displayImage(imgData.user, imgData.message);
    // autoScrollDown();
});

//append message 
function appendMessage(message) 
{
    const messageElement = document.createElement('div');
    let className = "announce" ;
    messageElement.classList.add(className, "msg"); 

    messageElement.innerText = message;
    messageArea.append(messageElement);
}

//auto scrolling down 
function autoScrollDown()
{
    messageArea.scrollTop = messageArea.scrollHeight ;
}

//other improvement 
//--------------------------------------

//Speech Recognition-----
try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
  }
  catch(e) {
    console.error(e);
    $('.no-browser-support').show();
  }
  
  $('#start-record-btn').on('click', function(e) {
    recognition.start();
  });
  
  recognition.onresult = (event) => {
    const speechToText = event.results[0][0].transcript;
   document.getElementById("textarea").value= speechToText;
    //console.log(speechToText)
    sndMsg(speechToText);
  }
