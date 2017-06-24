'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

// my vars and functions
const secret = require('./config/secret');          // secret vars
const vars = require('./config/vars');        // vars vars
const lib = require('./lib/lib1');               // function lib





const app = express();

app.set('port', (process.env.PORT || 5000));

// Allow us to process the data
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// routes

app.get('/', function(req, res){
    res.send('Hi I am a facebookbot');
});


// Facebook
app.get('/webhook/', function(req, res){
    if(req.query['hub.verify_token'] === secret.verify_token){
        res.send(req.query['hub.challenge']); // good
    }
    res.send("Wrong token ~~~~~");
});

// Here bot reply message to sender on facebook/messager
app.post('/webhook/', (req, res)=>{
    let messaging_events = req.body.entry[0].messaging;
    for(let i=0; i< messaging_events.length; i++){
        let event = messaging_events[i];
        let sender = event.sender.id;

        if(event.message && event.message.text){
            let text = event.message.text;
            sendText(sender, "Text echo: " + text.substring(0,100));
        }
        
    }
    res.sendStatus(200);
});


function sendText(sender, text){
    let messageData = {text: text};
    lib.sendRequest(sender, messageData);

}

/*
function sendRequest(sender, messageData){
        request({
        url:"https://graph.facebook.com/v2.6/me/messages",
        qs:{access_token : secret.access_token},
        method:"POST",
        json: {
            recipient: { id: sender},
            message: messageData
        }
    }, (error, response, body)=>{
        if(error){
            console.log("sending error");
        }else if(response.body.error){
            console.log("response body error");
        }
    });
}*/


app.listen(app.get('port'), ()=>{
    console.log("running: port");
});