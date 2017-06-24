const request = require('request');
const vars = require('../config/vars');
const secret = require('../config/secret');          // secret vars

let self = module.exports;

module.exports.decideMessage = (sender, text, isPostback=false)=>{

    text = text.toLowerCase();
    if(!isPostback){
        if(text.includes("offer"))
        {
            let triggerPayload=0;
            self.sendText(sender, "Getting offers(triggerPayload"+triggerPayload+")");
            self.sendButtonMessage(sender, "Choose one of those:",triggerPayload);


        }else if(text.includes('debug')){
            self.sendText(sender, self.getButtonsByTriggerPayload(0));
            self.sendText(sender, "debug1");
            
        } else {
            self.sendText(sender, "Sorry, I don't understand that");
        }
    }else{
        self.sendText(sender, "Getting offers(triggerPayload"+triggerPayload+")");
        self.sendButtonMessage(sender, "Choose one of those:",triggerPayload);
    }
    
}

module.exports.sendButtonMessage = (sender, text, triggerPayload) => {
    let buttons = [];
    self.getButtonsByTriggerPayload(triggerPayload, (btns)=>{
        if(btns != undefined && btns.length != 0) { buttons = btns; }
    })

    /*
   
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
*/  
    let messageData;
    if(buttons.length > 0 ){
        messageData = {
            "attachment":{
                "type":"template",
                "payload":{
                    "template_type":"button",
                    "text":text,
                    "buttons":buttons
                }
            }
        }
    } else{
        messageData = "No more selections";
    }
    
    self.sendRequest(sender, messageData);
}

module.exports.getButtonsByTriggerPayload = (triggerPayload, callback) =>{
    let buttons=[];
    switch(triggerPayload){
        case 0:
            for(let i=0; i<vars.buttons.length; i++){
                if(vars.buttons[i].triggerPayload == triggerPayload)
                buttons.push(vars.buttons[i]);
                break;
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

