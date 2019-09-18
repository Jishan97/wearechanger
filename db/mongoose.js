// const mongoose = require('mongoose');


// mongoose.Promise=global.Promise;
// mongoose.connect('mongodb+srv://jishan:anisa123@cluster0-i8lei.mongodb.net/test?retryWrites=true&w=majority');

// module.exports={
//     mongoose
// };


const mongoose = require('mongoose');


mongoose.Promise=global.Promise;
mongoose.connect('mongodb+srv://admin:admin123@cluster0-f1gpb.mongodb.net/test?retryWrites=true&w=majority');

module.exports={
    mongoose
};




