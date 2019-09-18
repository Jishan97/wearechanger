var mongoose = require('mongoose');
const Schema = mongoose.Schema;



const userschema = new Schema({


    password:{
        type:String
    },
    target:{
        type:String,
        default:'admin'
    }

});

var adminPassword =  mongoose.model('adminpassword',userschema);

module.exports={adminPassword}
