module.exports = {
    verify_token:''
    ,access_token:''
    ,requestUri:'https://graph.facebook.com/v2.6/me/messages'
    ,db_cloud:'_TO_BE_ADDED_'
    ,db_local: 'mongodb://localhost:27017/mybot'
    ,db_secret:'mongodb_secret'


}

//curl -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=EAAbvwR6d39IBALEjKwWKktsmCnMySYE2T2xJUUNU2gVxItuJoYLwNQbCQKIhwF4ZAeg7BsJYSUAtBXXxQ1VwtdAPDetvyC6WrCxtLb6simlSiWWIK6WfgteqVnihwssDQRFSpPz9NzdOst6twbsFS5gvtcmhsz8fOhb1f8AZDZD"

//curl -ik -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=<token>"