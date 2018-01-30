const vars = require('../config/vars');
const mongoose = require('mongoose');
const lib = require('../lib/lib1');
const CameraSchema = mongoose.Schema({

    tags:{type:[String]},
    url:{type:String}

}, {collection:'camera'});

const Camera = module.exports = mongoose.model('camera', CameraSchema);

// find all return as array
module.exports.findAll_pm = () =>{
    return new Promise((resolve, reject) =>{
        Camera.find({}, (err, data)=>{
            if(err){
                reject("Data not available, try again.")
            }
            
            resolve(data);
        })
    
    });
}

// find matches return as array
module.exports.findAllByQueryObject_pm = (obj) =>{
    // might search on different db base 
    return new Promise((res, rej) =>{

        let inTags = obj.tags;
        Camera.find({}, (err, data) =>{
            if(err) rej("Error, try again");
 
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
                    rej("No relevant data found.");
                }
                
            }
            else {rej("No relevant data found.");}
            
        })
    });
}