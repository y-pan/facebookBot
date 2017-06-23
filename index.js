'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

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
    if(req.query['hub.verify_token' === "icentennial"]){
        res.send(req.query['hub.challenge']); // good
    }
    res.send("Wrong token");
});

app.listen(app.get('port'), ()=>{
    console.log("running: port");
})