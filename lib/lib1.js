const request = require('request');
const vars = require('../config/vars');
const secret = require('../config/secret');          // secret vars

let self = module.exports;

module.exports.decideMessage = (sender, text)=>{

    text = text.toLowerCase();
            
    if(text.includes("offer") && text.includes("toronto"))
    {
        self.sendText(sender, vars.offerMenus.offerMenu1 + ", \n" + vars.offerMenus.offerMenu2);
    }else if(text.includes(vars.offerMenus.offerMenu3.toLowerCase()))
    {
        self.sendText(sender, "I guess you want menu3: " + vars.offerMenus.offerMenu3_1 + " oh yes");
    }else
    {
        self.sendText(sender, "Text echo: " + text.substring(0,100));
        self.sendButtonMessage(sender, "What is your favorite season?");
    }
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
                        "title":"Summer",
                        "payload":"summer"
                    },
                    {
                        "type":"postback",
                        "title":"Winter",
                        "payload":"winter"
                    }
                ]
            }
        }
    }
    self.sendRequest(sender, messageData);
}

