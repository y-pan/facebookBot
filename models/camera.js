const vars = require('../config/vars');
const mongoose = require('mongoose');
const lib = require('../lib/lib1');
const CameraSchema = mongoose.Schema({

    tags:{type:[String]},
    url:{type:String}

}, {collection:'camera'});

const Camera = module.exports = mongoose.model('camera', CameraSchema);


// RULE: 1 - searching in db only 2 kinds of result as promise: data (not empty) or err(exception, or empty data)
 

// find all return as array
module.exports.findAll_pm = () =>{
    return new Promise((resolve, reject) =>{
        Camera.find({}, (err, data)=>{
            if(err){
                reject(vars.msgSomeError)
            }
            if(data.constructor === Array && data.length > 0){
                resolve(data);
            }else{
                reject(vars.msgNoData)
            }
            
        })
    
    });
}

// find matches return as array
module.exports.findAllByQueryObject_pm = (obj) =>{
    // might search on different db base 
    return new Promise((res, rej) =>{

        let inTags = obj.tags;
        Camera.find({}, (err, data) =>{
            if(err) rej(vars.msgSomeError);
 
            if(data.constructor === Array && data.length > 0) { 
                let _cameras = [];
                for(let i=0; i<data.length; i++){                    
                    if(lib.isArraysOverlap(data[i].tags, inTags)){
                        _cameras.push(data[i]);
                    }
                }
                if(_cameras.length > 0){
                    res(_cameras);
                }else{
                    rej(vars.msgNoData);
                }
                
            }
            else {rej(vars.msgNoData);}
            
        })
    });
}