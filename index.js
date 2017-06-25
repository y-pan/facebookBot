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
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});
  
function receivedMessage(event) {
  // Putting a stub for now, we'll expand it in the following steps
  console.log("Message data: ", event.message);
}




app.listen(app.get('port'), ()=>{
    console.log("running: port", app.get('port'));
});

