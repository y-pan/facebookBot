const request = require('request');
const vars = require('../config/vars');
const secret = require('../config/secret');          // secret vars

let self = module.exports;

module.exports.decideMessage = (sender, text)=>{

    text = text.toLowerCase();
            
    if(text.includes("offer"))
    {

        let level=0;
        self.sendText(sender, "Getting offers(level"+level+")");
        self.sendButtonMessage(sender, "Choose one your like:",level);


    }else if(text.includes('debug')){
        self.sendText(sender, self.getButtonsByLevel(0));
        self.sendText(sender, "debug1");
        
    } else {
        self.sendText(sender, "Sorry, I don't understand that");
    }
}

module.exports.sendButtonMessage = (sender, text, level) => {
    let buttons = [];
    self.getButtonsByLevel(level, (btns)=>{
        buttons = btns;
    })

    
   
    let messageData2 = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":text,
        "buttons":[
          {
            "type":"web_url",
            "url":"www.centennialcollege.ca",
            "title":"Open centennial web"
          },
          {
            "type":"postback",
            "title":"Start Chatting",
            "payload":"USER_DEFINED_PAYLOAD"
          }
          , { "type":"postback", "title":"menu1", "payload":"1" }
          
          

        ]
      }
    }
}

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
    self.sendRequest(sender, messageData);
}

module.exports.getButtonsByLevel = (level, callback) =>{
    let buttons=[];
    switch(level){
        case 0:
            for(let i=0; i<vars.level0.menus.length; i++){
                let m = vars.level0.menus[i];
                let btn = {
                    "type":"postback",
                    "title":m["title"],
                    "payload":m["payload"]
                };
                buttons.push(btn);
            }
            
        break;
    }
    callback(buttons);
}

module.exports.sendRequest = (sender, messageData) =>{
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
}

module.exports.sendText = (sender, text) =>{
    let messageData = {text: text};
    self.sendRequest(sender, messageData);
}

