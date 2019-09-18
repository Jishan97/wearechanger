var mongoose = require('mongoose');
const Schema = mongoose.Schema;



const userschema = new Schema({


    email:{
        type:String,
        required:true
    },

    accepted:{
        type:String,
        default:'pending'
    },
    date:{
        type:String
    }

});

var Meeting =  mongoose.model('meeting',userschema);

module.exports={Meeting}
