var mongoose = require('mongoose');
const Schema = mongoose.Schema;



const userschema = new Schema({


    msg:{
        type:String
    },
    target:{
        type:String,
        default:'admin'
    }

});

var defaultMsg =  mongoose.model('defaultmsg',userschema);

module.exports={defaultMsg}
