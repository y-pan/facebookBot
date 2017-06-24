const request = require('request');
const vars = require('../config/vars');
const secret = require('../config/secret');          // secret vars
let self = module.exports;

module.exports.sender=null;  // for debugging only, normally pass everything needed as parameter to method if necessary, just my preference


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
            self.sendText(sender, "debug4");
        } else {
            self.sendText(sender, "Sorry, I don't understand that");
        }
    }else{
        let triggerPayload = text.toLowerCase();
        self.sendText(sender, "From your selection(pload="+triggerPayload+"), we have:");
        
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
    self.sendText(self.sender, "total:"+vars.collections.length);
    for( let i=0; i<vars.collections.length; i++){
        let c = vars.collections[i];

        self.sendText(self.sender, "if "+c.triggerPayload+"="+triggerPayload+"?");
        if(c.triggerPayload.toLowerCase() == triggerPayload.toLowerCase()){
            self.temp = c.data;
            self.sendText(self.sender, "Yes=");
            break;
        }else{
            self.sendText(self.sender, "thisNot=");
        }
    }
}

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

