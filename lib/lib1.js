const request = require('request');
const vars = require('../config/vars');
const secret = require('../config/secret');          // secret vars

let self = module.exports;

module.exports.decideMessage = (sender, text)=>{

    text = text.toLowerCase();
            
    if(text.includes("offer"))
    {
        //self.sendText(sender, vars.offerMenus.offerMenu1 + ", \n" + vars.offerMenus.offerMenu2);
        //self.sendText(sender, "Getting offers");
        self.sendButtonMessage(sender, "Choose one your like:");

        self.sendText(sender, "Getting offers done");

    }else if(text.includes('debug')){
        //self.sendText(sender, self.getButtonsByLevel(0));
        self.sendText(sender, "debug1");
        
    } else {
        self.sendText(sender, "Sorry, I don't understand that");
    }
}

module.exports.sendButtonMessage = (sender, text) => {
    //let buttons = [];
    //self.getButtonsByLevel(level, (btns)=>{
    //    buttons = btns;
    //})

    let buttons = vars.level0.menus;
   
    let messageData = {
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"button",
                "text":text,
                "buttons":[
                    { "type":"postback", "title":"menu1", "payload":"1" },
                    { "type":"postback", "title":"menu2", "payload":"2" },
                    { "type":"postback", "title":"menu3", "payload":"3" },
                    { "type":"postback", "title":"menu4", "payload":"4" },
                    { "type":"postback", "title":"menu5", "payload":"5" },
                    { "type":"postback", "title":"menu6", "payload":"6" }
                ]
            }
        }
    }
    self.sendRequest(sender, messageData);
}
/*
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
}*/

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

