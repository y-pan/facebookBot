const request = require('request');
const vars = require('../config/vars');
const secret = require('../config/secret');          // secret vars
let self = module.exports;

module.exports.temp=null;
// main entry of lib1
module.exports.decideMessage = (sender, text, isPostback=false)=>{

    text = text.toLowerCase();
    if(!isPostback){
        if(text.includes("offer"))
        {
            let triggerPayload=0;
            self.sendText(sender, "Here are offers: ");
            
            self.getSelectionByTriggerPayload2temp(triggerPayload);
            if(self.temp == null){
                self.sendText(sender, "No more buttons in collection");
            }else{
                self.sendButtonMessage(sender, "Choose one of those:",self.temp);
            }
            /*
            self.getButtonsByTriggerPayload(triggerPayload, (btns)=>{
                if(btns == null){
                    self.sendText(sender, "No more buttons in collection");
                }else{
                    self.sendButtonMessage(sender, "Choose one of those:",btns);
                }
            })*/

        }else if(text.includes('debug')){
            self.sendText(sender, "debug3");
        } else {
            self.sendText(sender, "Sorry, I don't understand that");
        }
    }else{
        self.sendText(sender, "This is genarated by your previous selection");
        let triggerPayload = text;
        self.getSelectionByTriggerPayload2temp(triggerPayload);
        if(self.temp == null){
            self.sendText(sender, "No more buttons in collection");
        }else{
            self.sendButtonMessage(sender, "Choose one of those:",self.temp);
        }
        /*
        self.getButtonsByTriggerPayload(triggerPayload, (btns)=>{
            if(btns == null){
                self.sendText(sender, "No more buttons in collection");
            }else{
                self.sendButtonMessage(sender, "Choose one of those:",btns);
            }
        })*/
    }
    
}

module.exports.getSelectionByTriggerPayload2temp = (triggerPayload) =>{
    self.temp = null;
    for( let i=0; i<vars.collections.length; i++){
        let c = vars.collections[i];
        if(c.triggerPayload == triggerPayload){
            self.temp = vars.collections[i].data;
            break;
        }
    }
}

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



module.exports.sendButtonMessage = (sender, text, buttons) => {
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
        messageData = "No more button selections";
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

