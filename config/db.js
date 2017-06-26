// simulate mongodb, will be replaced. Need to be lowercase
module.exports.text2x = [
    {from:'offer', to:"bu1,2,3"}
    ,{from:'toronto', to:"bu4,14,24"}
    ,{from:'markham', to:"te25"}
    ,{from:'walmart', to:"te26"}
    ,{from:'college', to:"ge1"}
    ,{from:'vr', to:"ge2"}

]


// text collection
module.exports.te=[
    { id:'1', data:'This is te1'}
    ,{ id:'2', data:'This is te2'}
    ,{ id:'3', data:'This is te3'}
    ,{ id:'4', data:'This is te4'}
    ,{ id:'5', data:'This is te5'}
    ,{ id:'6', data:'This is te6'}
    ,{ id:'7', data:'This is te7'}
    ,{ id:'8', data:'This is te8'}
    ,{ id:'9', data:'This is te9'}
    ,{ id:'10', data:'This is te10'}
    ,{ id:'11', data:'This is te11'}
    ,{ id:'12', data:'This is te12'}
    ,{ id:'13', data:'This is te13'}
    ,{ id:'14', data:'This is te14'}
    ,{ id:'15', data:'This is te15'}
    ,{ id:'16', data:'This is te16'}
    ,{ id:'17', data:'This is te17'}
    ,{ id:'18', data:'This is te18'}
    ,{ id:'19', data:'This is te19'}
    ,{ id:'20', data:'This is te20'}
    ,{ id:'21', data:'This is te21'}
    ,{ id:'22', data:'This is te22'}
    ,{ id:'23', data:'This is te23'}
    ,{ id:'24', data:'This is te24'}
    ,{ id:'25', data:'This is te25'}
    ,{ id:'26', data:'This is te26'}
    ,{ id:'27', data:'This is te27'}
    ,{ id:'28', data:'This is te28'}
    ,{ id:'29', data:'This is te29'}
    ,{ id:'30', data:'This is te30'}
    ,{ id:'31', data:'This is te31'}
    ,{ id:'32', data:'This is te32'}
    ,{ id:'33', data:'This is te33'}
    ,{ id:'34', data:'Centennial College'}

]


// button collection, payload could refer to multiple buttons like bu2-bu3-bu4
module.exports.bu= [
    { id:'1',data:{type:"postback", title:"button1", payload:"bu11,bu12,bu13"} }
    ,{ id:'2',data:{type:"postback", title:"button2", payload:"bu21,bu22,bu23" }}
    ,{ id:'3',data:{type:"postback", title:"button3", payload:"bu31,bu32,bu33" }}
    ,{ id:'4',data:{type:"postback", title:"button4", payload:"te4" }}
    ,{ id:'5',data:{type:"postback", title:"button5", payload:"te5" }}
    ,{ id:'6',data:{type:"postback", title:"button6", payload:"te6" }}
    ,{ id:'7',data:{type:"postback", title:"button7", payload:"te7" }}
    ,{ id:'8',data:{type:"postback", title:"button8", payload:"te8" }}
    ,{ id:'9',data:{type:"postback", title:"button9", payload:"te9" }}
    ,{ id:'10',data:{type:"postback", title:"button10", payload:"te10" }}
    ,{ id:'11',data:{type:"postback", title:"button11", payload:"te11" }}
    ,{ id:'12',data:{type:"postback", title:"button12", payload:"te12" }}
    ,{ id:'13',data:{type:"postback", title:"button13", payload:"te13" }}
    ,{ id:'14',data:{type:"postback", title:"button14", payload:"te14" }}
    ,{ id:'15',data:{type:"postback", title:"button15", payload:"te15" }}
    ,{ id:'16',data:{type:"postback", title:"button16", payload:"te16" }}
    ,{ id:'17',data:{type:"postback", title:"button17", payload:"te17" }}
    ,{ id:'18',data:{type:"postback", title:"button18", payload:"te18" }}
    ,{ id:'19',data:{type:"postback", title:"button19", payload:"te19" }}
    ,{ id:'20',data:{type:"postback", title:"button20", payload:"te20" }}
    ,{ id:'21',data:{type:"postback", title:"button21", payload:"te21" }}
    ,{ id:'22',data:{type:"postback", title:"button22", payload:"te22" }}
    ,{ id:'23',data:{type:"postback", title:"button23", payload:"te23" }}
    ,{ id:'24',data:{type:"postback", title:"button24", payload:"te24" }}
    ,{ id:'25',data:{type:"postback", title:"button25", payload:"te25" }}
    ,{ id:'26',data:{type:"postback", title:"button26", payload:"te26" }}
    ,{ id:'27',data:{type:"postback", title:"button27", payload:"te27" }}
    ,{ id:'28',data:{type:"postback", title:"button28", payload:"te28" }}
    ,{ id:'29',data:{type:"postback", title:"button29", payload:"te29" }}
    ,{ id:'30',data:{type:"postback", title:"button30", payload:"te30" }}
    ,{ id:'31',data:{type:"postback", title:"button31", payload:"te31" }}
    ,{ id:'32',data:{type:"postback", title:"button32", payload:"te32" }}
    ,{ id:'33',data:{type:"postback", title:"button33", payload:"te33" }}
]

// generic
module.exports.ge=[
    { id:'1', name:'college', 
    data:[{
            title: "Centennial College",
            subtitle: "Ontario first college",
            item_url: "https://www.centennialcollege.ca",               
            image_url: "https://www.centennialcollege.ca/i/logo.svg",
            buttons: [{
              type: "web_url",
              url: "https://www.centennialcollege.ca",
              title: "Open Centennial Web"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "Seneca College",
            subtitle: "Ontario college, likes red color",
            item_url: "http://www.senecacollege.ca/",               
            image_url: "http://www.senecacollege.ca/shared/images/Seneca-50-BIM.svg",
            buttons: [{
              type: "web_url",
              url: "http://www.senecacollege.ca/",
              title: "Open Seneca Web"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]    
    }
    ,{ id:'2', name:'rift', 
    data:[{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",               
            image_url: "http://messengerdemo.parseapp.com/img/rift.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",               
            image_url: "http://messengerdemo.parseapp.com/img/touch.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]    
    }
]