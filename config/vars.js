module.exports.message_data_type = {
    text:0,button:1,gif:2,audio:3,video:4,file:5,
    generic:6,receipt:7,quick_reply:8,read_receipt:9,typing_on:10,
    typing_off:11,acount_linking:12,message_attachment:13
}

module.exports.generic_elemetns = [

]
// text collection
module.exports.te=[
    {
        id:'0',
        data:'This is te0'
    }
    ,{
        id:'1',
        data:'This is te1'
    }
    ,{
        id:'2',
        data:'This is te2'
    }
    ,{
        id:'3',
        data:'This is te3'
    }
    ,{
        id:'4',
        data:'This is te4'
    }
    ,{
        id:'5',
        data:'This is te5'
    }
]


// button collection
module.exports.bu= [
    { 
        id:'0',
        data:[
            { type:"postback", title:"open button1", payload:"bu1" },
            { type:"postback", title:"open button2", payload:"bu2" },
            { type:"postback", title:"open button3", payload:"bu3" }]
    }
    ,{ 
        id:'1',
        data:[
            { type:"postback", title:"see text0", payload:"te0" },
            { type:"postback", title:"see text1", payload:"te1" },
            { type:"postback", title:"see text2", payload:"te2" }]
    }
    ,{ 
        id:'2',
        data:[
            { type:"postback", title:"see text3", payload:"te3" },
            { type:"postback", title:"see text4", payload:"te4" },
            { type:"postback", title:"see text5", payload:"te5" }]
    }
    ,{ 
        id:'3',
        data:[
            { type:"postback", title:"see text6", payload:"te6" },
            { type:"postback", title:"see text7", payload:"te7" },
            { type:"postback", title:"see text8", payload:"te8" }]
    }
]
