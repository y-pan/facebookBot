const vars = require('../config/vars');
const mongoose = require('mongoose');
const lib = require('../lib/lib1');
const CameraSchema = mongoose.Schema({
    des:{type:String},
    tags:{type:[String]},
    url:{type:String}

}, {collection:'camera'});
// des: whole description
// tags: array of key words in des
// url: url of image

// camera: {des:des, tags:[tag], url:url }
/**
 *     
    tag:{type:String},
    url:{type:String}
 */
const Camera = module.exports = mongoose.model('camera', CameraSchema);


// RULE: 1 - searching in db only 2 kinds of result as promise: data (not empty) or err(exception, or empty data)
 // 

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
module.exports.findCameraMatches_pm = (text, distance_threshold) =>{
    // text is already all lowercase
    // return promise: {"data":data[i],"distance":distance}, or errString
    return new Promise((res, rej) =>{
        //
        let inArr = text.split(' ');
        let matchTags = 0;

        //
        Camera.find({}, (err, data) =>{
            if(err) rej(vars.msgSomeError);
            if(data.constructor === Array && data.length > 0) { 
                // data is camera: {des:des, tags:[tag], url:url }

                let _camera_distance_array = []; // targets

                for(let i=0; i<data.length; i++){     
                    let cam = data[i];
                    let tags = cam.tags; // string array
                    let des = cam.des;
                    let tagCount = 0; 

                    if(tags.constructor === Array && tags.length > 0){
                         // 1st check tags, have to match at least 1 tag
                        tagCount = 0;    
                        tags.forEach(tag =>{
                            // 404,407 issue
                            let _t=tag.trim();
                            if(_t!=null && _t.length>0 && text.indexOf(_t)>=0){
                                tagCount++;
                            }
                        });
                        if(tagCount > 0){
                            // 2nd check description, calculate distance
                            let distance = lib.evalDistance(des, text); // vars.string_compare_distance_threshold applied in method               
                            if(distance != null ){// either null or number  // js (0) can be false !!!!, so better explicitly compare with null, and use return null in function for nothing or error
                                _camera_distance_array.push({"data":cam,"tagCount":tagCount,"distance":distance}); // so all matched distance standard
                            }
                        }
                    }else{
                        continue;
                    }
                }

                if(_camera_distance_array.constructor===Array && _camera_distance_array.length > 0){
                    let tops = []; // to contain best matches of {"data":cam,"tagCount":tagCount,"distance":distance}
                    console.log("tagCount > 0 && distance != null => _camera_distance_array:")
                    console.log(_camera_distance_array)
                    tops = lib.getByHighestTagCount(_camera_distance_array, vars.result_limit);//vars.result_limit is softLimit, might get more, and will need to further filter
                    if(tops.length > vars.result_limit){
                        // further filtering
                        tops = lib.getByLowestDistance(tops, vars.result_limit); // like the top 5 (lowest ones in distance) 
                    }
                    
                    if(!tops || tops.length == 0 ){
                        rej(vars.msgNoData);
                    }else{
                        res(tops);
                    }
                }else{
                    rej(vars.msgNoData);
                }
            }
            else {rej(vars.msgNoData);}            
        })
    });
}
/*
// old 
module.exports.findAndMatchTag_pm = (tag, distance_threshold) =>{
    // return promise: {"data":data[i],"distance":distance}, or errString
    return new Promise((res, rej) =>{
        Camera.find({}, (err, data) =>{
            if(err) rej(vars.msgSomeError);
            if(data.constructor === Array && data.length > 0) { 
                let _camera_distance_array = [];
                for(let i=0; i<data.length; i++){      
                    let distance = lib.evalDistance(data[i].tag, tag); // vars.string_compare_distance_threshold applied in method               
                    if(distance != null ){// either null or number  // js (0) can be false !!!!, so better explicitly compare with null, and use return null in function for nothing or error
                        _camera_distance_array.push({"data":data[i],"distance":distance}); // so all matched distance standard
                    }
                }
                if(_camera_distance_array.constructor===Array && _camera_distance_array.length > 0){
                    let tops = [];
                    tops = lib.getTops(_camera_distance_array, vars.result_limit); // like the top 5 (lowest ones in distance) 
                    if(!tops || tops.length == 0 ){
                        rej(vars.msgNoData);
                    }else{
                        res(tops);
                    }
                }else{
                    rej(vars.msgNoData);
                }
            }
            else {rej(vars.msgNoData);}            
        })
    });
}
*/
// find matches return as array  (deprecated, as data structure changed, no more tags array, but single tag string)
module.exports.findAllByQueryObject_old_pm = (obj) =>{
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