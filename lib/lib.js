const request = require('request');
const vars = require('../config/vars');

let self = module.exports;

module.exports.decideMessage = (sender, text) => {
    let _text = text.toLowerCase();
    if(_text.includes("offer")){
        self.sendButtonMessage(sender,"Here are the current offers:")
    } else{
        self.sendText("Could you explain it a bit more? I'm not sure what you mean.");
    }
}


module.exports.sendRequest = (sender, messageData) =>{
    request({
        url:"https://graph.facebook.com/v2.6/me/messages",
        qs:{access_token : Secret.access_token},
        method:"POST",
        json: {
            recipient: {id: sender},
            message: messageData
        }
    }, (error, response, body)=>{
        if(error){
            console.log("sending error")
        }else if(response.body.error){
            console.log("response body error");
        }
    });
}
   
module.exports.sendButtonMessage = (sender, text) => {
    let messageData = {
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"button",
                "text":text,
                "buttons":[
                    {
                        "type":"postback",
                        "payload":vars.offerMenus.offerMenu1,
                        "title":vars.offerMenus.offerMenu1
                    },
                    {
                       "type":"postback",
                        "payload":vars.offerMenus.offerMenu2,
                        "title":vars.offerMenus.offerMenu2
                    },
                    {
                       "type":"postback",
                        "payload":vars.offerMenus.offerMenu3,
                        "title":vars.offerMenus.offerMenu3
                    }
                ]
            }
        }
    }
    self.sendRequest(sender, messageData);
}

module.exports.sendText = (sender, text) => {
    let messageData = {text: text}
    self.sendRequest(sender, messageData);
}