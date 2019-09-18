var mongoose = require('mongoose');
const Schema = mongoose.Schema;



const userschema = new Schema({


    msg1:{
        type:String
    },
    target:{
        type:String,
        default:'admin'
    }

});

var defaultMeetingMsg =  mongoose.model('defaultmeetingmsg',userschema);

module.exports={defaultMeetingMsg}
