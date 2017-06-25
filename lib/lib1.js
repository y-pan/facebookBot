// for basic functions, like manipulating arrays, objects, values

const vars = require('../config/vars');
const secret = require('../config/secret');          // secret vars
const db=require('../config/db');
let self = module.exports;

module.exports.retrieveTeById = (id, callback) => {
    let text;
    for(let i=0; i< db.te.length; i++){
        if(db.te[i].id == id) {text=db.te[i].data; break;}
    }

    callback(text);
}

module.exports.recognizeText = (text, callback) =>{
    let feedback=null;
    for(let i=0; i< db.text2x.length; i++){
        if(_text.includes(db.text2x[i].from)){
            feedback = db.text2x[i].to;
            break;
        }
    }
    callback(feedback); // a string or null
}

////////////////////////////////

module.exports.getMsg = (trigger, callback)=>{
    let msg=null;
    console.log("~~~~~~~~~ inside lib.getMessageData");
    switch(trigger){
        case 0:
            msg = {   
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
        break;
        case 1:
            msg = {   
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
        default:
        break;

    }
    callback(msg);
}