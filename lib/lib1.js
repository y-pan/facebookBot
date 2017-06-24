const request = require('request');
const vars = require('../config/vars');
const secret = require('../config/secret');          // secret vars

let self = module.exports;

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

module.exports.decideMessage = (sender, text)=>{

    text = text.toLowerCase();
            
    if(text.includes("offer") && text.includes("toronto"))
    {
        self.sendText(sender, vars.offerMenu1 + ", " + vars.offerMenu2);
    }else if(text.includes(vars.offerMenu3))
    {
        self.sendText(sender, "I guess you want menu3: " + vars.offerMenu3_1);
    }else
    {
        self.sendText(sender, "Text echo: " + text.substring(0,100));
    }
}
