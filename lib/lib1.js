const request = require('request');
const vars = require('../config/vars');
const secret = require('../config/secret');          // secret vars
let self = module.exports;

module.exports.sender=null;


// main entry of lib1
module.exports.decideMessage = (sender, text, isPostback=false)=>{
    self.sender = sender;
    text = text.toLowerCase();
    if(!isPostback){
        if(text.includes("offer"))
        {
            let triggerPayload='0';
            self.sendText(sender, "Here are offers: ");
            
            self.getSelectionByTriggerPayload2temp(triggerPayload);
            if(self.temp == null){
                self.sendText(sender, "No more buttons in collection");
            }else{
                self.sendButtonMessage(sender, "Choose one of those:",self.temp);
            }


        }else if(text.includes('debug')){
            self.sendText(sender, "debug3");
        } else {
            self.sendText(sender, "Sorry, I don't understand that");
        }
    }else{
        let triggerPayload = text;
        self.sendText(sender, "This is genarated by your previous selection where pload="+triggerPayload);
        
        self.getSelectionByTriggerPayload2temp(triggerPayload);
        if(self.temp == null){
            self.sendText(sender, "No more buttons in collection");
        }else{
            self.sendButtonMessage(sender, "Choose one of those:",self.temp);
        }

    }
    
}
module.exports.temp=null;

module.exports.getSelectionByTriggerPayload2temp = (triggerPayload) =>{
    self.temp = null;
    for( let i=0; i<vars.collections.length; i++){
        let c = vars.collections[i];
        self.sendText(self.sender, "if "+c.triggerPayload+"="+triggerPayload+"?");
        if(c.triggerPayload == triggerPayload.toLowerCase()){
            self.temp = c.data;
            self.sendText(self.sender, "is=");
            break;
        }
        self.sendText(self.sender, "!=");
        
    }
}
/*
module.exports.getButtonsByTriggerPayload = (triggerPayload, callback) =>{
    
    let idx=-1;;
    for( let i=0; i<vars.collections.length; i++){
        let c = vars.collections[i];
        if(c.triggerPayload == triggerPayload) {
            idx = i;
            break;
        }
    }
    if(idx <0) callback(null);
    else{
        callback(vars.collections[idx]);
    }
}
*/


module.exports.sendButtonMessage = (sender, text, buttons) => {
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

