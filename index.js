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

        lib.sendText(sender, "event="+JSON.stringify(event));

        if(event.postback){
            let text = JSON.stringify(event.postback.payload);
            lib.decideMessage(sender, text, true);
            
        }else if(event.message && event.message.text){
            lib.decideMessage(sender, event.message.text, false);
        }
        
    }
    res.sendStatus(200);
});




app.listen(app.get('port'), ()=>{
    console.log("running: port");
});