const leven = require('leven'); // Measure the difference between two strings, JS implementation of the Levenshtein distance algorithm
const vars = require('../config/vars');              // vars (general config vars)

const self = module.exports;
module.exports.toString = ()=>{
    return "this is lib1";
}
module.exports.getByHighestTagCount = (data, softLimit) => {
    console.log("[!!!!!!! -1- !!!!!!!!] in getByHighestTagCount, data size: " + data.length);

    let arr = [];
    data.sort((a,b) =>{return b.tagCount - a.tagCount}); // already sort data in place, no need to use 
    if(data.length <= softLimit) {
        console.log("[!!!!!!! -1- !!!!!!!!] end of getByHighestTagCount, data size: " + data.length);

        return data; // not enough elements already, just return whatever in arr
    }
    // so we have more items then softLimit, need to filter by tagCount, and softLimit means you select the top ones having high tagCount, and
    // say softLimit=5, then you get 5 items with high tagCount, the 5th item's has the lowest tagCount of the 5 items,
    // and that I call "leastCount", and if some other item's tagCount is equal to "leastCount", this is a tie, shouldn't be ignored,
    // and we should include them as well, result in more items than softLimit. And I will use other measure(distance) to break the ties
    data.forEach(d => {
        console.log(d.data.des + "=> " + d.tagCount + "|"+d.distance )
    })
    let leastCount = 0;
    
    // get top elements with highest tagCount first,   5 : 0-4
    for(let i=0, len=data.length; i<len; i++){
        if(i < softLimit){
            arr.push(data[i]);
        }else{
            break;
        }
    }

    // so we touched softLimit, and maybe there'are more similar options we need to further care about if better options (same tagCount, but could be better in distance measuring)
    leastCount = arr[arr.length-1].tagCount;
    for(let j = arr.length, len = data.length; j < len; j++){
        if(data[j].tagCount >= leastCount){  // actually == is enough, but maybe I'm extra defensive
            arr.push(data[j]);
        }else{
            break; // since it is always sorted by tagCount from hight to low
        }
    }
    console.log("[!!!!!!! -1- !!!!!!!!] end of getByHighestTagCount, data size: " + arr.length);
    console.log(arr);
    console.log("___end of listing array___getByHighestTagCount");
    return arr;
}

module.exports.getByLowestDistance = (data, hardLimit) => {
    console.log("[!!!!!!! -2- !!!!!!!!] in getByLowestDistance, data size: " + data.length);

    if(data.length <= hardLimit) {
        console.log("[!!!!!!! -2- !!!!!!!!] end of getByLowestDistance, data size: " + data.length);
        return data; // no need to further filter
    }
    // now extra items in data; need to further filter by distance
    let tops = [];
    let leastCount = data[data.length-1].tagCount; // last one is the least count, will be multiple item with same leasCount, need to filter some of them out
    let pendingIndices = [];

    for(let i=0; i<data.length; i++){
        if(data[i].tagCount <= leastCount){
            pendingIndices.push(i);  // there're cases all item have same tagCount, results in empty tops
        }else{
            tops.push(data[i]); 
        }
    }
    console.log("temp tops size=" + tops.length);
    console.log(tops);
    
    console.log("pendingIndices size=" + pendingIndices.length);
    console.log(pendingIndices);
    

    data.sort((a,b) => {return a.distance - b.distance}); // sort ascending by distance
    for(let i=0, len=data.length; i<len; i++){
        console.log("i=" + i);
        for(let j = 0; j<pendingIndices.length; j++){
        console.log("j=" + j);
        console.log("i==p[j]?" + i + " =? " + pendingIndices[j]);
            
            if(i == pendingIndices[j]){
                tops.push(data[i]);
                console.log("new tops size: " + tops.length)
                pendingIndices.splice(j,1);
                console.log("pendingIndices removed item " + i + " => ")
                console.log(pendingIndices);
                break; // break loop in pendingIndices, shortcut to next item of data
            }
        }
        if(tops.length == hardLimit) { break; }
    }
    console.log("[!!!!!!! -2- !!!!!!!!] end of getByLowestDistance, tops size: " + tops.length);
    console.log(tops);
    console.log("___end of listing array___getByLowestDistance");    
    return tops;
}
module.exports.evalDistance = (string1, string2) =>{
    if(!string1 || !string2 || string1.length == 0 || string2.length == 0){
        return null;
    }
    if(string1 && string1.length >0){
        string1 = string1.trim().toLowerCase();
    }
    if(string2 && string2.length >0){
        string2 = string2.trim().toLowerCase();
    }
    let dis = leven(string1, string2)
    // console.log("@@@leven: " + string1 + " | " + string2 + " => " + dis);
/**
 *  It is at least the difference of the sizes of the two strings.
    It is at most the length of the longer string.
    It is zero if and only if the strings are equal.
    If the strings are the same size, the Hamming distance is an upper bound on the Levenshtein distance. 
*/
    return dis;
    // if(dis <= vars.string_compare_distance_threshold){
    //     return dis;
    // }else{
    //     return null;
    // }
}


module.exports.isArraysOverlap = (array1, array2) => {
    for(let i=0; i<array1.length; i++){
        for(let j=0; j<array2.length; j++){
            if(array1[i] == array2[j]){return true;}
        }
    }
    return false;
}

module.exports.getMsg = (trigger, callback)=>{
    let msg=null;
    // console.log("~~~~~~~~~ inside lib.getMessageData");
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




// let myCamera = require('../models/camera');

// module.exports.myCamera = myCamera;

// module.exports.searchDb_pm = (text) =>{
//     return new Promise((res, rej) =>{
//         let feedback = null;
//         let tags = text.split(" ");
//         // logic to determing which collection to search, now only look into "camera" in db
//         console.log("@@@TAGS:"+text);

//         // urls = ["http://opendata.toronto.ca/transportation/tmc/rescucameraimages/CameraImages/loc9113.jpg",
//         //      "https://www.toronto.ca/data/transportation/roadrestrictions/CameraImages/loc8073.jpg"]
//         // res(urls);

//         myCamera.findAll_pm().then((urls)=>{
//             if(urls.constructor === Array){
//                 res(urls);
//             }
//             rej("some error occursed");
//         }).catch((err)=>{
//             rej("some error occursed");
//         });

//         // Camera.findAllByQueryObject_pm({"tags": tags}).then(urls =>{
//         //     res(urls);
//         // }).catch(err =>{
//         //     rej(err);
//         // });

//     });
// }
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

