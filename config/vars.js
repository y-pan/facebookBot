// module.exports.message_data_type = {
//     text:0,button:1,gif:2,audio:3,video:4,file:5,
//     generic:6,receipt:7,quick_reply:8,read_receipt:9,typing_on:10,
//     typing_off:11,acount_linking:12,message_attachment:13
// }
// module.exports.delim=","
module.exports = {
    useLocal:false,
    delim:",",
    requestUri:'https://graph.facebook.com/v2.6/me/messages',
    
    msgSomeError : "Some error occurred, try again.",
    msgNoData : "No relevant data found",
    string_compare_distance_threshold : 10000   /* not in use, since tagCount is used as 1st(major) filter, distance is used to break the ties   */
    , result_limit: 5
}
