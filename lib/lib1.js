let myCamera = require('../models/camera');

module.exports.myCamera = myCamera;

module.exports.searchDb_pm = (text) =>{
    return new Promise((res, rej) =>{
        let feedback = null;
        let tags = text.split(" ");
        // logic to determing which collection to search, now only look into "camera" in db
        console.log("@@@TAGS:"+text);

        // urls = ["http://opendata.toronto.ca/transportation/tmc/rescucameraimages/CameraImages/loc9113.jpg",
        //      "https://www.toronto.ca/data/transportation/roadrestrictions/CameraImages/loc8073.jpg"]
        // res(urls);

        myCamera.findAll_pm().then((urls)=>{
            if(urls.constructor === Array){
                res(urls);
            }
            rej("some error occursed");
        }).catch((err)=>{
            rej("some error occursed");
        });

        // Camera.findAllByQueryObject_pm({"tags": tags}).then(urls =>{
        //     res(urls);
        // }).catch(err =>{
        //     rej(err);
        // });

    });
}
/*
module.exports.recognizeText = (text, callback) =>{
    // deprecatd , use promise instead
    let feedback=null;
    feedback = "Looking into DB for: " + text;
    // for(let i=0; i< db.text2x.length; i++){
    //     if(text.includes(db.text2x[i].from)){
    //         feedback = db.text2x[i].to;
    //         break;
    //     }
    // }
    callback(feedback); // a string or null
}*/

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

module.exports.isArraysOverlap = (array1, array2) => {
    for(let i=0; i<array1.length; i++){
        for(let j=0; j<array2.length; j++){
            if(array1[i] == array2[j]){return true;}
        }
    }
    return false;
}