const vars = require('../config/vars');
const mongoose = require('mongoose');
const lib = require('../lib/lib1');
const CameraSchema = mongoose.Schema({

    tags:{type:[String]},
    url:{type:String}

}, {collection:'camera'});

const Camera = module.exports = mongoose.model('camera', CameraSchema);

module.exports.findAll = () =>{
    return new Promise((resolve, reject) =>{
        Camera.find({}, (err, data)=>{
            if(err){
                reject("Data not available, try again.")
            }
            resolve(data);
        })
    
    });
}