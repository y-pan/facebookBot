'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

// my vars and functions
const secret = require('./config/secret');          // secret vars
const vars = require('./config/vars');        // vars vars
//const lib = require('./lib/lib1');               // function lib
let selfSender;
let selfTemp=null;

const app = express();
app.set('port', (process.env.PORT || 5000));

// Allow us to process the data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// routes
app.get('/', function(req, res){
    res.send('Hi I am a facebookbot');
});


// Facebook
app.get('/webhook/', function(req, res){
    if(req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === secret.verify_token){
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']); // good
    }
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403).send("Wrong token ~~~~~");
});

// Here bot reply message to sender on facebook/messager
app.post('/webhook/', (req, res)=>{

    req.body.entry[0].messaging.forEach(function(event){
        let sender = event.sender.id;
        //console.log(pageID +"(p)=?(e)" +sender);
        console.log("===1.event===",JSON.stringify(event));
        console.log("===2.event.message===",JSON.stringify(event.message));
        console.log("===3.event.message.text===",JSON.stringify(event.message.text));
        if(event.message && event.message.text){
            decideMessage(sender, event.message.text, false);
        }

        if(event.postback){
            let text = JSON.stringify(event.postback.payload);
            decideMessage(sender, text, true);
        }
    })

    res.sendStatus(200);

});




app.listen(app.get('port'), ()=>{
    console.log("running: port", app.get('port'));
});


/**funcs
 * 
 */

function decideMessage(sender, text, isPostback=false){
    selfSender = sender;
    text = text.toLowerCase();
    if(!isPostback){
        if(text.includes("offer"))
        {
            let triggerPayload='0';
            sendText(sender, "Here are offers: ");
            
            getSelectionByTriggerPayload2temp(triggerPayload);
            if(selfTemp == null){
                sendText(sender, "No more buttons in collection");
            }else{
                sendButtonMessage(sender, "Choose one of those:",selfTemp);
            }
        }else if(text.includes('debug')){
            sendText(sender, "debug4");
        } else {
            sendText(sender, "Sorry, I don't understand that");
        }
    }else{
        let triggerPayload = text.toLowerCase();
        sendText(sender, "From your selection(pload="+triggerPayload+"), we have:");
        
        getSelectionByTriggerPayload2temp(triggerPayload);
        if(selfTemp == null){
            sendText(sender, "No more buttons in collection");
        }else{
            sendButtonMessage(sender, "Choose one of those:",selfTemp);
        }
    }
}

function getSelectionByTriggerPayload2temp(triggerPayload){
    selfTemp = null;
    sendText(selfSender, "total:"+vars.collections.length);
    for( let i=0; i<vars.collections.length; i++){
        let c = vars.collections[i];

        sendText(selfSender, "if "+c.triggerPayload+"="+triggerPayload+"?");
        if(c.triggerPayload.toLowerCase() == triggerPayload.toLowerCase()){
            selfTemp = c.data;
            sendText(selfSender, "Yes=");
            break;
        }else{
            sendText(selfSender, "thisNot=");
        }
    }
}

function sendButtonMessage (sender, text, buttons){
    let messageData = {
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"button",
                "text":text,
                "buttons":buttons
            }
        }
    }
    sendRequest(sender, messageData);
}

function sendRequest(sender, messageData){
        request({
        url:secret.requestUri,
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
}

function sendText(sender, text){
    let messageData = {text: text};
    sendRequest(sender, messageData);
}