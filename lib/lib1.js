const request = require('request');
const vars = require('../config/vars');
const secret = require('../config/secret');          // secret vars

let self = module.exports;

module.exports.decideMessage = (sender, text)=>{

    text = text.toLowerCase();
            
    if(text.includes("offer") && text.includes("toronto"))
    {
        //self.sendText(sender, vars.offerMenus.offerMenu1 + ", \n" + vars.offerMenus.offerMenu2);
        self.sendButtonMessage(sender, "Choose one your like:", 0);

    } else {
        self.sendText(sender, "Sorry, I don't understand that");
    }
}

module.exports.sendButtonMessage = (sender, text, level) => {
    let messageData = {
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"button",
                "text":text,
                "buttons":self.getButtonsByLevel(level)
            }
        }
    }
    self.sendRequest(sender, messageData);
}

module.exports.getButtonsByLevel = (level) =>{
    let buttons = [];
    switch(level){
        case 0:
            vars.level0.menus.forEach(function(menu) {
                let btn = {
                    type:"postback",
                    title:menu.title,
                    payload:menu.payload
                }
                buttons.push(menu);
            });
        break;
    }
    return buttons;
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

