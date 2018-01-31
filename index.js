'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const mongoose = require('mongoose');
const Camera = require('./models/camera'); // not using router, make it simple for now, make traffic camera working smoothly is enough now...

// const secret = require('./config/secret');          // secret vars
const vars = require('./config/vars');              // vars (general config vars)
const lib = require('./lib/lib1');                  // function lib: manipulating arrays, objects, values
// const db = require('./config/db');  // simulate mongodb for now

const app = express();
let secret = "";
let verify_token = "";
let access_token = "";
let testingVar = "";
let dbConnection = "";
let dbConnectionStatus = "Connection to";

let useLocal = vars.useLocal;
// useLocal = true;
if (useLocal) {
    secret = require('./config/secret');
    verify_token = secret.access_token;
    access_token = secret.access_token;
    testingVar = "_local_testing_var_";
    dbConnection = secret.db_local;
    dbConnectionStatus += " LOCAL-DB: ";
} else { // not onlly db, but env variables are from heroku env
    verify_token = process.env.verify_token;
    access_token = process.env.access_token;
    testingVar = process.env.testingVar;
    dbConnection = process.env.db_cloud;
    dbConnectionStatus += " CLOUD-DB: ";
}

mongoose.Promise = global.Promise;  // db will always use local
mongoose.connect(dbConnection).then(() => {
    dbConnectionStatus += "SUCCESSFUL";
    Camera.findAll_pm().then((data) => {
        dbConnectionStatus += " fetched 1st record: " + data[0] + " TOTAL data size:" + data.length;
    }).catch((data) => {
        dbConnectionStatus += " failed to validate data somehow~~~, check server/db, try later";
    });
}).catch(() => {
    dbConnectionStatus += "FAILED";
});

app.set('port', (process.env.PORT || 5000));

// Allow us to process the data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
app.get('/', function (req, res) {
    let greeting = 'Hi I am a facebookbot, v1: testingVar= ' + testingVar + "\n" + dbConnectionStatus;
    console.log(greeting)
    res.send(greeting);
});

// Facebook
app.get('/webhook', function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === verify_token) {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']); // good
    }
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403).send("Wrong token ~~~~~~~~");
});

app.post('/webhook', function (req, res) {
    var data = req.body;

    // Make sure this is a page subscription
    if (data.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach(function (entry) {
            var pageID = entry.id;
            var timeOfEvent = entry.time;

            // Iterate over each messaging event
            entry.messaging.forEach(function (event) {
                if (event.message) {
                    receivedMessage(event);       // user send text into bot 
                    /**
                     * ******************************************
                     * ******************************************
                     *             [main entryPoint]  
                     * ******************************************
                     * ******************************************
                    */
                } else if (event.postback) { // not my concern so far
                    replyMessageOrPostback(event, null);   // user postback to bot
                } else {
                    /******************************** to add more events ******************************/
                    console.log("Webhook received unknown event");//, event);
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

app.listen(app.get('port'), () => {
    console.log("running: port", app.get('port'));

    // test
    test()

});

function test(){
    console.log(lib.toString())
    let string1 = "toronto";
    let string2 = "torontt";
    let result = lib.evalDistance(string1, string2);
    console.log(result);
}

/**
 * ---------------------------------------------------------------------------
 *                    Here are functions of logic
 * ---------------------------------------------------------------------------
 */


function receivedMessage(event) {
    let senderID = event.sender.id;
    let recipientID = event.recipient.id;
    let timeOfMessage = event.timestamp;
    let message = event.message;
    console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));
    let messageId = message.mid;

    // You may get a text or attachment but not both
    let messageText ;
    let messageAttachments;

    if(message && message.text){
        messageText = message.text.toLowerCase();
    }
    if(messageAttachments){
        messageAttachments = message.attachments;
    }

    if (messageText) {
        // text
        searchDb_pm(messageText)
            .then(camera_distances => {
                // [{"data":camera,"distance":distance}]
                console.log("@@@cameras size: " + camera_distances.length);
                camera_distances.forEach(item => {
                    // item: {"data":camera,"distance":distance}
                    console.log("@@@!!!item is: ");

                    console.log(item);
                    console.log("@@@!!!item.data is: ");

                    console.log(item.data);
                    console.log("@@@!!!item.data.tag is: ");

                    console.log(item.data.tag);
                    console.log("@@@!!!send camera.url: " + item.data.url);
                    console.log("@@@!!!result dis: " + item.distance);
                    sendTextMessage(senderID,  + item.data.tag + " \n:  " + item.data.url);
                });
                // replyMessageOrPostback(event, str);
            })
            .catch(err => {
                sendTextMessage(senderID, err);
            });

    } else if (messageAttachments) {      /******************** to add attachemnt message (non-text type) **********************/
        sendTextMessage(senderID, "Message with attachment received, need to implement to store it in db (url) and server (actual file)");
    }
}




function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: { id: recipientId },
        message: { text: messageText }
    };
    callSendAPI(messageData);
}



function sendButtonMessage(recipientId, messageText, buttons) {
    var messageData = {
        recipient: { id: recipientId },
        message: {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": messageText,
                    "buttons": buttons
                }
            }
        }
    }
    callSendAPI(messageData);
}

// if payload == null, then it is replying the incomming message, not postback
function replyMessageOrPostback(event, payload = null) {
    let tb, ids;
    if (!payload) {
        console.log("Received postback for user %d and page %d with payload '%s' " + "at %d", event.sender.id, event.recipient.id, event.postback.payload, event.timestamp);
        payload = event.postback.payload;
    }
    console.log("@@@PAYLOAD: " + payload);
    sendTextMessage(event.sender.id, "REPLYING MSG: " + payload);

}

function callSendAPI(messageData) {
    console.log("@@@begin callSendAPI");
    request({
        uri: vars.requestUri,
        qs: { access_token: access_token },
        method: 'POST',
        json: messageData

    }, function (error, response, body) {
        console.log("@@@begin callSendAPI => messageData\n");
        console.log(messageData);

        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;
            console.log("Successfully sent generic message with id %s to recipient %s", messageId, recipientId);
        } else {
            console.error("Unable to send message.");
            console.error("@@@begin callSendAPI => response:n");
            console.error(response);
            console.error("@@@begin callSendAPI => error: \n");
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



function searchDb_pm(text) {
    return new Promise((res, rej) => {
        Camera.findAndMatchTag_pm(text)
            .then((data) => {
                res(data); // get only top 5, as [{"data":camera,"distance":distance}]   
            }).catch((err) => {
                rej(err);
            });

    });
}