// for basic functions, like manipulating arrays, objects, values

const vars = require('../config/vars');
// const secret = require('../config/secret');          // secret vars
const db=require('../config/db');
let self = module.exports;

module.exports.retrieveTeById = (ids, callback) => {
    // assume ids passed in is always single for Te, no ',' in ids string
    let text;
    for(let i=0; i< db.te.length; i++){
        if(db.te[i].id == ids) {text=db.te[i].data; break;}
    }
    callback(text);
}
module.exports.retrieveBuById = (ids, callback) =>{
    let buttons = [];
    let idArray =[];
    if(ids.includes(vars.delim)){
        idArray = ids.split(vars.delim);
        for(let i=0; i< idArray.length; i++){
            for(let j=0; j < db.bu.length; j++){
                if(idArray[i] == db.bu[j].id){ buttons.push(db.bu[j].data); break;} // assume id is unique in all kind of collections
            }
        }
    }else{
        for(let j=0; j < db.bu.length; j++){
            if(ids == db.bu[j].id){ buttons.push(db.bu[j].data); break;} // assume id is unique in all kind of collections
        }
    }
    callback(buttons);
}
module.exports.retrieveGeById = (ids, callback) =>{ // assume just single id passed in
    let data = null;
    for(let i = 0; i< db.ge.length; i++){
        if(ids == db.ge[i].id){ data = db.ge[i].data; break; }
    }
    callback(data);

}
module.exports.recognizeText = (text, callback) =>{
    let feedback=null;
    for(let i=0; i< db.text2x.length; i++){
        if(text.includes(db.text2x[i].from)){
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