// for basic functions, like manipulating arrays, objects, values

const vars = require('../config/vars');
const secret = require('../config/secret');          // secret vars
let self = module.exports;

module.exports.getMessageData = (trigger, recipientId, callback)=>{
    let messageData;
    console.log("~~~~~~~~~ inside lib.getMessageData");
    switch(trigger){
        case 0:
            messageData = {   
                recipient: { id: recipientId },
                message: {
                    "attachment":{
                        "type":"template",
                        "payload":{
                            "template_type":"button",
                            "text":"Response from " + trigger,
                            "buttons":[
                                { type:"postback", title:"0->menu1", payload:1 },
                                { type:"postback", title:"0->menu2", payload:2 },
                                { type:"postback", title:"0->menu3", payload:3 }
                            ]
                        }
                    }
                }
            }
        break;
        case 1:
            messageData = {   
                recipient: { id: recipientId },
                message: {
                    "attachment":{
                        "type":"template",
                        "payload":{
                            "template_type":"button",
                            "text":"Response from " + trigger,
                            "buttons":[
                                { type:"postback", title:"1->menu4", payload:4 },
                                { type:"postback", title:"1->menu5", payload:5 },
                                { type:"postback", title:"1->menu6", payload:6 }
                            ]
                        }
                    }
                }
            }
        default:
        break;

    }
    

    callback(messageData);
}