module.exports.message_data_type = {
    text:0,button:1,gif:2,audio:3,video:4,file:5,
    generic:6,receipt:7,quick_reply:8,read_receipt:9,typing_on:10,
    typing_off:11,acount_linking:12,message_attachment:13
}

module.exports.generic_elemetns = [

]



module.exports.buttons= [
    { 
        triggerPayload:'0',
        data:[
            { type:"postback", title:"0->menu1", payload:"bu1" },
            { type:"postback", title:"0->menu2", payload:"bu2" },
            { type:"postback", title:"0->menu3", payload:"bu2" }]
    }
    ,{ 
        triggerPayload:'1',
        data:[
            { type:"postback", title:"1->menu4", payload:"bu4" },
            { type:"postback", title:"1->menu5", payload:"bu5" },
            { type:"postback", title:"1->menu6", payload:"bu6" }]
    }
    ,{ 
        triggerPayload:'2',
        data:[
            { type:"postback", title:"2->menu7", payload:"bu7" },
            { type:"postback", title:"2->menu8", payload:"bu8" },
            { type:"postback", title:"2->menu9", payload:"bu9" }]
    }
    ,{ 
        triggerPayload:'3',
        data:[
            { type:"postback", title:"3->menu10", payload:"te1" },
            { type:"postback", title:"3->menu11", payload:"te2" },
            { type:"postback", title:"3->menu12", payload:"te3" }]
    }
]
