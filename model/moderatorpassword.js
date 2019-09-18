var mongoose = require('mongoose');
const Schema = mongoose.Schema;



const userschema = new Schema({


    password:{
        type:String
    },
    target:{
        type:String,
        default:'moderator'
    }

});

var moderatorPassword =  mongoose.model('moderatoepassword',userschema);

module.exports={moderatorPassword}
