var mongoose = require('mongoose');
const Schema = mongoose.Schema;



const userschema = new Schema({
    mobile:{
        type:String
    },

    gender:{
        type:String
    },

    age:{
        type:String
    },

    state:{
        type:String
    },

    city:{
        type:String
    },


    email:{
        type:String,
        required:true
    },

  username:{
    type:String,
    required:true
  },
 password:{
     type:String,
     required:true
 },

 reference:{
     type:String,
     default:'N/A'
 },
 profession:{
    type:String,
    default:"details not yet shared"
},

experience:{
    type:String,
    default:"details not yet shared"
    
},
date:{
    type:String,
    default:"details not yet shared"
},

question:{
    type:String,
    default:"details not yet shared"
},
education:{
    type:String,
    default:"details not yet shared"
},
accepted:{
    type:String,
    default:'pending'
}

});

var User =  mongoose.model('user',userschema);

module.exports={User}
