module.exports.MESSAGE_DATA_TYPE = {
    TEXT:0,BUTTON:1,GIF:2,AUDIO:3,VIDEO:4,FILE:5,
    GENERIC:6,RECEIPT:7,QUICK_REPLY:8,READ_RECEIPT:9,TYPING_ON:10,
    TYPING_OFF:11,ACOUNT_LINKING:12,MESSAGE_ATTACHMENT:13
}

module.exports.GENERIC_ELEMETNS = [

]



module.exports.BUTTONS= [
    { 
        triggerPayload:'0',
        data:[
            { type:"postback", title:"0->menu1", payload:1 },
            { type:"postback", title:"0->menu2", payload:2 },
            { type:"postback", title:"0->menu3", payload:3 }]
    }
    ,{ 
        triggerPayload:'1',
        data:[
            { type:"postback", title:"1->menu4", payload:4 },
            { type:"postback", title:"1->menu5", payload:5 },
            { type:"postback", title:"1->menu6", payload:6 }]
    }
    ,{ 
        triggerPayload:'2',
        data:[
            { type:"postback", title:"2->menu7", payload:7 },
            { type:"postback", title:"2->menu8", payload:8 },
            { type:"postback", title:"2->menu9", payload:9 }]
    }
    ,{ 
        triggerPayload:'3',
        data:[
            { type:"postback", title:"3->menu10", payload:10 },
            { type:"postback", title:"3->menu11", payload:11 },
            { type:"postback", title:"3->menu12", payload:12 }]
    }
]
