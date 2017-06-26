'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');


const secret = require('./config/secret');          // secret vars
const vars = require('./config/vars');              // vars (general config vars)
const lib = require('./lib/lib1');                  // function lib: manipulating arrays, objects, values
const db = require('./config/db');  // simulate mongodb for now

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
app.get('/webhook', function(req, res){
    if(req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === secret.verify_token){
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']); // good
    }
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403).send("Wrong token ~~~~~");
});

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);       // message type event is like : user type "offer", 
        } else if(event.postback) {
            receivedPostback(event);   // postback type event is like : user click on button having payload
        }else{   /*here to add more events */
            console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});

app.listen(app.get('port'), ()=>{
    console.log("running: port", app.get('port'));
});


/**
 * 
 *  Here are functions of logic
 * 
 */


function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;
  console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));
  var messageId = message.mid;

  // You may get a text or attachment but not both
  var messageText = message.text.toLowerCase();
  var messageAttachments = message.attachments;

  if (messageText) {
    lib.recognizeText(messageText,(dataString)=>{
        if(dataString == null){
            sendTextMessage(senderID, "Sorry, I don't know what to do with: "+messageText.substring(0,100));
        }else{
            reply_receivedMessage(event, dataString); // general, like receivedPostback()
        }
    });

/*
    if(messageText.includes("offer"))   // text-oriented, to be put in a function to search keydb : {keywords: String, goto:String}, and use goto to find elements
    {
        sendButtonMessage(senderID,"Response of offer");
    }else if(messageText.includes("toronto"))
    {
        //sendTextMessage(senderID, "Requrest Toronto is under testing");
        sendButtonMessage(senderID,"Response of tornto");

    }else{
        sendTextMessage(senderID, "Sorry, I don't understand this: "+messageText.substring(0,100));
    }
*/
  } else if (messageAttachments) {  /**attachemnt type of message */
    sendTextMessage(senderID, "Message with attachment received, need to implement to store it in db (url) and server (actual file)");
  }
}




function sendTextMessage(recipientId, messageText) {
  var messageData = {   recipient: { id: recipientId },
                        message: { text: messageText }
  };
  callSendAPI(messageData);
}
function sendButtonMessage(recipientId, messageText, buttons) {
    var messageData = {   
        recipient: { id: recipientId },
        message: {
            "attachment":{
                "type":"template",
                "payload":{
                    "template_type":"button",
                    "text":messageText,
                    "buttons":buttons
                }
            }
        }
    }
  callSendAPI(messageData);
}

function reply_receivedMessage(event, dataString){
    let tb = dataString.substring(0,2);
    let ids = dataString.substring(2);
    
    switch(tb){
        case "te":  // assume "te" (text type) always be single
            lib.retrieveTeById(ids,(text)=>{
                sendTextMessage(event.sender.id, text);
            })
            break;
        case "bu":  // bu can be multiple: "bu1,2,3"
            //sendTextMessage(event.sender.id, "Oops, still under developing in receivedPostback() for other tb type");
            lib.retrieveBuById(ids,(buttons)=>{
                if(buttons.length <= 0){
                    sendTextMessage(event.sender.id,"Oops, can't find any buttons~~~");
                }else{
                    sendButtonMessage(event.sender.id,"Please select one:",buttons);
                }
            });
            
            
            break;
        default:
            sendTextMessage(event.sender.id, "Oops, still under developing in reply_receivedMessage() for other tb type");
            break;
    }
}

function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;
  var payload = event.postback.payload;
  console.log("Received postback for user %d and page %d with payload '%s' " + "at %d", senderID, recipientID, payload, timeOfPostback);

  let tb = payload.substring(0, 2); // db collection(table) name
  let ids = payload.substring(2);    // id in the collection
  switch(tb){
    case "te":
        lib.retrieveTeById(ids,(text)=>{
            sendTextMessage(senderID, text);
        })
        break;
    case "bu":
        lib.retrieveBuById(ids,(buttons)=>{
            if(buttons.length <= 0){
                sendTextMessage(event.sender.id,"Oops, can't find any buttons~~~");
            }else{
                sendButtonMessage(event.sender.id,"Please select one:",buttons);
            }
        });
        break;
    case "im":
        sendTextMessage(event.sender.id, "Oops, still under developing in receivedPostback() for other tb type");
        break;
    case "ge":
        lib.retrieveGeById(ids,(elemetns) => {
            if(elements.length <= 0){
                sendTextMessage(event.sender.id,"Oops, can't find any generic record~~~");
            }else{
                sendGenericMessage(event.sender.id,elements);
            }
        });
        break;
    default:
        sendTextMessage(event.sender.id, "Oops, still under developing in receivedPostback() for other tb type");
        break;
  }
}

function callSendAPI(messageData) {
  request({
    uri: secret.requestUri,
    qs: { access_token: secret.access_token },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;
      console.log("Successfully sent generic message with id %s to recipient %s", messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}
/** not in use | to be changed*/
function sendGenericMessage(recipientId, elements) {
   // need function with callback to return generic elemetns (how to link different type of element together? like genericId? )
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: elements
        }
      }
    }
  };  
  callSendAPI(messageData);
}


/*
function retrieveTeById(id, callback){
    let text;
    for(let i=0; i< db.te.length; i++){
        if(db.te[i].id == id) {text=db.te[i].data; break;}
    }
    callback(text);
}
*/
/*
function sendButtonMessageOnPostback(recipientId, messageText) {
    var messageData = {   
        recipient: { id: recipientId },
        message: {
            "attachment":{
                "type":"template",
                "payload":{
                    "template_type":"button",
                    "text":messageText,
                    "buttons":[
                        { type:"postback", title:"1->menu1", payload:"te4" },
                        { type:"postback", title:"1->menu2", payload:"te5" },
                        { type:"postback", title:"1->menu3", payload:"te6" }
                    ]
                }
            }
        }
    }
  callSendAPI(messageData);
}
*/