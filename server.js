const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
var {mongoose} = require('./db/mongoose');
var {User} = require('./model/user');
var {Meeting} = require('./model/meeting');
var {defaultMsg} = require('./model/defaultmsg');
var {defaultMeetingMsg} = require('./model/defaultMeetingMsg');
var {defaultA} = require('./model/defaultA');
var {defaultD} = require('./model/defaultD');
var {adminPassword} = require('./model/adminpassword');
var {moderatorPassword} = require('./model/moderatorpassword');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const async = require('async')
var nodemailer = require('nodemailer');
var flash = require('connect-flash')
var alert = require('alert-node')
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));
var json2xls = require('json2xls');
app.use(json2xls.middleware);
app.use(flash())
app.use(function(req, res, next){
    res.locals.message = req.flash('message');
    next();
});


app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }))

app.engine('handlebars', exphbs({ 
    
    defaultLayout: 'main',
    helpers:require('./helpers')
 }))


app.set('view engine', 'handlebars')


app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/public'));


 app.get('/resgistrationP',(req,res)=>{
    res.render('register')
 })


 app.get('/referralP',async(req,res)=>{

    const data = await User.find({})


    const session_n = req.session.adminOrMod
    console.log(session_n)

    res.render('referralP',{
        data,session_n

    })
 })


 app.get('/resgistrationP/:refer',(req,res)=>{
     const para = req.params.refer;
    res.render('register',{
        para
    })
 })



 app.get('/loginTrial',(req,res)=>{
   
   res.render('loginTrial')
})





//all users
app.get('/allusers',async(req,res)=>{
const result = await User.find({})
const session_n = req.session.adminOrMod
  console.log(session_n)
    res.render('allU',{
        result,session_n
    })
      
 })
//////////////////////////////////////////////////////////////
 app.get('/groupEmail',async(req,res)=>{



    const result = await User.find({})
  




     
    console.log(result)
    res.render('groupemail',{
      result
   
  
  });
      
 })
////////////////////////////////////////////////////////////////////////////
// app.get('/individualEmail',async(req,res)=>{

//     async.concat([User,Meeting],function(model,callback) {
//         var query = model.find({});
//         query.exec(function(err,docs) {
//           if (err) throw err;
//           callback(err,docs);
//         });
//       },
//       function(err,result) {
//         if (err) throw err;
    
//        console.log(result)
//         res.render('individualEmail',{
//           result
       
      
//       });
      
    
//       })
      
//  })
////////////////////////////////////////////////////////////////////////////////

app.get('/meet',async(req,res)=>{
    const data = await User.find({})
const data1 = []

data.map((one)=>{
    if(one.accepted==='accepted'){
        data1.push(one)
    }
})
    

    res.render('meet',{
        data1
    })
})


















 //all users

/// -------------- changeP-----------
app.get('/changeP',async(req,res)=>{

        const data = await adminPassword.find({})
        const data1 = await moderatorPassword.find({})
console.log(data);
  
res.render('changeP',{
    data,data1
})
 })


 app.post('/changeP',(req,res)=>{

    const pass = req.body.password;

    const filter = { target: 'admin' };
    const update = { password:pass };
    
    // `doc` is the document _before_ `update` was applied
     adminPassword.findOneAndUpdate(filter, update).then((result)=>{
         console.log(result)
         res.redirect('/changeP')
     })
  
 })


 
 app.post('/changePM',(req,res)=>{

    const pass = req.body.password;

    const filter = { target: 'moderator' };
    const update = { password:pass };
    

     moderatorPassword.findOneAndUpdate(filter, update).then((result)=>{
         console.log(result)
         res.redirect('/changeP')
     })


    // var insert = new moderatorPassword({
    //     password:pass
    // })
  
    //     insert.save((one)=>{
    //         console.log(one);
    //     })
 })



/// -------------- meeting-----------
 app.get('/meetingP',(req,res)=>{
    res.render('meetingP')
 })

 app.post('/meetingD',async (req,res)=>{
  
   const email=req.session.session_name;
   console.log(email)
    const education = req.body.education;
    const profession = req.body.profession;
    const experince = req.body.experince;
    const date = req.body.date;
    const question = req.body.question;

    const meeting = new Meeting({
        email:email,
        accepted:"pending",
        date:date
    })

    meeting.save().then((result)=>{
        console.log(result);
    })




//     var user = new User({
//         email,education,profession,experince,date,question,meeting
//    });

//    // save model to database
//    meeting.save()
//    .then((result)=>{
//        console.log(result)
//        res.send(result)
//    })
const filter = { email: email };
const update = { education,profession,experince,date,question };

// `doc` is the document _before_ `update` was applied
 User.findOneAndUpdate(filter, update).then((result)=>{
     console.log(result)
 })

//  res.redirect('/meetingExit')
  res.redirect('/trailDashboard')

 })



 app.get('/trailDashboard', async(req,res)=>{
     const email = req.session.session_name;
     console.log(email)

     const data = await User.find({email})
     if(req.session.session_name) {
     res.render('trialDashboard',{
         data
     })
    }
    else{
        res.redirect('/')
    }
    })





app.get('/logout',(req,res)=>{
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        }
        console.log('sucessfully logout');
    
        res.redirect('/adminP')
      })
})
app.get('/logoutU',(req,res)=>{
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        }
        console.log('sucessfully logout');
    
        res.redirect('/')
      })
})





/// -------------- meeting-----------


app.post('/register',async(req,res)=>{
    req.session.session_name=req.body.email;
    const reference=req.body.refer;
    const email = req.body.email;
    const username = req.body.username;
    const age = req.body.age;
    const city = req.body.city;
    const state = req.body.state;
    const mobile = req.body.mobile;
    const gender = req.body.gender;
    const pass2 = req.body.password2
    const pass = req.body.password;   

    const reference1 = req.body.showthis;
    

    const fetchD = await User.find({email})
    const fetchD1 = await User.find({username})

if(pass!=pass2) {
    req.flash('message','password not match')
    res.redirect('/resgistrationP')
}


  else if(fetchD.length>1) {
    req.flash('message','email already exits')
    res.redirect('/resgistrationP')
  }

  else if(fetchD1.length>1) {
    req.flash('message','username already exits')
    res.redirect('/resgistrationP')
  }
 

  else if(reference1==='' && reference==='') {
    const reference='kushpal'
    console.log(reference1);
var user = new User({
    username:username,
    email:email,
   password:pass,
   city,
   age,
   state,
   mobile,
   gender,
   reference
});
user.save()
.then((result)=>{
 //  console.log(result)
   // res.send(result)
   res.render('videoshowcase',{
    reference
   })
})
const msg = []
const data = await defaultMsg.find({})
console.log(data)

data.map((one)=>{
   msg.push(one.msg)
})

console.log(msg[0])
 //target user


 //nodemailer process starts

 var transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: 'wearechanger@gmail.com',
       pass: '7404225687Dd'
     }
   });
   
   var mailOptions = {
     from: 'wearechanger@gmail.com',
     to: email,
     subject: 'We are changers',
     text: msg[0]
   };
   
   transporter.sendMail(mailOptions, function(error, info){
     if (error) {
       console.log(error);
     } else {
       console.log('Email sent: ' + info.response);
     }
   });





}


        else if(reference==='' ) {
                console.log(reference1);
            var user = new User({
                username:username,
                email:email,
               password:pass,
               city,
               age,
               state,
               mobile,
               gender,
               reference:reference1
           });
           user.save()
           .then((result)=>{
             //  console.log(result)
               // res.send(result)
            //    res.render('videoshowcase')
           })

           const dataR = await User.find({username:reference1})


           res.render('videoshowcase',{
            dataR
           })
           const msg = []
           const data = await defaultMsg.find({})
           console.log(data)
         
           data.map((one)=>{
               msg.push(one.msg)
           })
         
           console.log(msg[0])
             //target user
         
         
             //nodemailer process starts
         
             var transporter = nodemailer.createTransport({
                 service: 'gmail',
                 auth: {
                   user: 'wearechanger@gmail.com',
                   pass: '7404225687Dd'
                 }
               });
               
               var mailOptions = {
                 from: 'wearechanger@gmail.com',
                 to: email,
                 subject: 'We are changers',
                 text: msg[0]
               };
               
               transporter.sendMail(mailOptions, function(error, info){
                 if (error) {
                   console.log(error);
                 } else {
                   console.log('Email sent: ' + info.response);
                 }
               });


        }


else{

   

  var user = new User({
         username:username,
         email:email,
        password:pass,
        city,
        age,
        state,
        mobile,
        gender,
        reference
    });
 
    // save model to database

    
    user.save()
    .then((result)=>{
      //  console.log(result)
        // res.send(result)
        // res.render('videoshowcase')
    })
    const dataR = await User.find({username:reference})


    res.render('videoshowcase',{
     dataR
    })

    /////////////////////////////////// after registration send email  

    //fetch the email msg
  const msg = []
  const data = await defaultMsg.find({})
  console.log(data)

  data.map((one)=>{
      msg.push(one.msg)
  })

  console.log(msg[0])
    //target user


    //nodemailer process starts

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'wearechanger@gmail.com',
          pass: '7404225687Dd'
        }
      });
      
      var mailOptions = {
        from: 'wearechanger@gmail.com',
        to: email,
        subject: 'We are changers',
        text: msg[0]
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });


    }




})

app.get('/',(req,res)=>{
    res.render('login')

})


app.get('/userDashboard', async(req,res)=>{
    const user = req.session.session_name;
     const name1 = []
    const  data = await User.find({email:user});
  
data.map((one)=>{
    name1.push(one.username)
})

const name = name1[0]
console.log(name1[0]);

  const data2 =  await User.find({})
const filteredD = []

data2.map((one)=>{
    if(one.reference===name) {
        filteredD.push(one)
    }
})
   if( req.session.session_name) {
     console.log(req.session.session_name)
    console.log(filteredD)
    res.render('userDashboard',{
        name,filteredD,data

    })
}
else{
    res.redirect('/')
}
})


app.post('/login', async (req,res)=>{
    req.session.session_name=req.body.email;
    
    const email = req.body.email;
    const pass = req.body.password;
    console.log(email)

    
    const valid = await User.find({email})
    data=valid;

 console.log(data.length);


  if(data.length>=1) {

    data.map((one)=>{
            if(one.email === email && one.accepted==='accepted' ) {
               
                res.redirect('/userDashboard')
            }  else {
                req.flash('message','sucessfull')
                res.redirect('/meetingP')
            }
        
    })

  }

  else { req.flash('message','wrong details')
  res.redirect('/')
  }

    // console.log(valid);
 

})





  app.post('/adminC',async(req,res)=>{
      const email = req.body.email
      const password = req.body.password
      
      req.session.adminOrMod = req.body.email
      console.log( req.session.adminOrMod)
console.log(email)

///fetch admin password

const Tadminpassword = await adminPassword.find({})
const adminPP=[]

Tadminpassword.map((one)=>{
    console.log(one.password);
    adminPP.push(one.password)
})

console.log(adminPP[0]);


      if(email === 'admin@wearechanger.in' && password=== adminPP[0]) {
          console.log('yes')
          res.redirect('/admin')
      }

      else {
        req.flash('message','wrong details')
          console.log('no')
          res.redirect('/adminP')
      }
  })


  app.post('/moderatorC', async(req,res)=>{
  
   
    const email = req.body.email
    const password = req.body.password
    req.session.adminOrMod = req.body.email
    console.log( req.session.adminOrMod)
    
const Tmoderatorpassword = await moderatorPassword.find({})
const moderatorPP=[]

Tmoderatorpassword.map((one)=>{
    console.log(one.password);
    moderatorPP.push(one.password)
})

console.log(moderatorPP[0]);
console.log(email)
    if(email === 'moderator@wearechanger.in' && password===moderatorPP[0] ) {
        console.log('yes')
        res.redirect('/admin')
    }

    else {
      req.flash('message','wrong details')
        console.log('no')
        res.redirect('/moderatorP')
    }
})




app.post('/register/:refer',(req,res)=>{
    req.session.session_name=req.body.email;
    req.session.sessionedR=req.params.refer;
    const refer = req.params.refer;
    const name = req.body.username;
    const pass = req.body.password;

    var user = new User({
         username:name,
        password:pass,
        reference:refer
    });
 
    // save model to database
    user.save()
    .then((result)=>{
        console.log(result)
        res.send(result)
    })


})




app.get('/admin', async(req,res)=>{

    

    const Current_Date =new Date().toJSON().slice(0,10);

    console.log('----------------------------------------------------------DATE',Current_Date )

const session_n = req.session.adminOrMod
    const data = await User.find({})

    const totalA = await User.count();
console.log(totalA);
    // console.log(data)


    const data2 = await User.find({})
    //  console.log(data);
  
      const data1 = []
      const pendingD=[]
      const approvedD=[]
  
      data2.map((one)=>{
          if(one.accepted==='pending' && one.date===Current_Date) {
                  data1.push(one)
          }
      })


  data2.map((one)=>{
      if(one.accepted==='pending') {
          pendingD.push(one)
      }
  })
  data2.map((one)=>{
    if(one.accepted==='accepted') {
        approvedD.push(one)
    }
})

  const countPendingD = pendingD.length;
  const countApprovedD = approvedD.length;


// console.log('-----------------------------------------------------PENDING',data1)

    res.render('adminindex',{
        data,totalA,session_n,data1,countPendingD,countApprovedD
    }
    )
})





app.get('/todaysMeeting',async(req,res)=>{
    const session_n = req.session.adminOrMod
    const Current_Date =new Date().toJSON().slice(0,10);
    const data2 = await User.find({})
    //  console.log(data);
  
      const data1 = []
  
      data2.map((one)=>{
        //   if(one.accepted==='accepted' && one.date===Current_Date) {
        //           data1.push(one)
        //   }
          if(one.accepted==='pending' && one.date===Current_Date) {
            data1.push(one)
    }
      })

// console.log('-----------------------------------------------------PENDING',data1)

    res.render('todaysMeeting',{
        data1,session_n
    }
    )
})



app.get('/register',(req,res)=>{
    User.find()
    .then((result)=>{
        console.log(result)
        res.send(result)
    })
})






/////////////////////////////////pending users


app.get('/pendingU',async(req,res)=>{
    const session_n = req.session.adminOrMod
    const Current_Date =new Date().toJSON().slice(0,10);
    const data = await User.find({})
  //  console.log(data);
console.log(Current_Date)

const month = new Date().toJSON().slice(5,7)
console.log(month)

const date = new Date().toJSON().slice(8,10)
console.log(date)


    const data1 = []

    data.map((one)=>{
        if(one.accepted==='pending' && one.date>Current_Date) {
                data1.push(one)
        }
    })
        console.log(data1)
    res.render('pendingU',{
        data1,session_n
    })
})


///////////////////////////// old meetings

app.get('/oldMeetings',async(req,res)=>{
    const session_n = req.session.adminOrMod
    const Current_Date =new Date().toJSON().slice(0,10);
    const data = await User.find({})
  //  console.log(data);
console.log(Current_Date)

const month = new Date().toJSON().slice(5,7)
console.log(month)

const date = new Date().toJSON().slice(8,10)
console.log(date)


    const data1 = []

    data.map((one)=>{
        if(one.date<Current_Date) {
                data1.push(one)
        }
    })
        console.log(data1)
    res.render('oldMeetings',{
        data1,session_n
    })
})





app.get('/rejectedU',async(req,res)=>{
    const session_n = req.session.adminOrMod
    const data = await User.find({})
  //  console.log(data);

    const data1 = []

    data.map((one)=>{
        if(one.accepted==='rejected') {
                data1.push(one)
        }
    })

    console.log(data1)
    res.render('rejectedU',{
        data1,session_n
    })
})



app.post('/accepttheuser',async(req,res)=>{

    const user = req.body.id;
    console.log('is this????',user);
  
    const filter = { email: user };
    const update = { accepted:'accepted' };
    
    // `doc` is the document _before_ `update` was applied
     User.findOneAndUpdate(filter, update).then((result)=>{
         console.log(result)
        res.redirect('/acceptedU')

     })
    
     // fetch the msg

     const msg = await defaultA.find({})
     const realMsg = []

     msg.map((one)=>{
         realMsg.push(one.msg1)
     })
     console.log(realMsg[0])
     // send email
     var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'wearechanger@gmail.com',
          pass: '7404225687Dd'
        }
      });
      
      var mailOptions = {
        from: 'wearechanger@gmail.com',
        to: user,
        subject: 'We are changers',
        text: realMsg[0]
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });


    //  const id = req.body.id;
    //  console.log(id)
     
    //  Meeting.remove({email:id}, function(err){
    //     if(err) throw err;
    // });
   
   
   
})


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/rejecttheusers',async(req,res)=>{

    const user = req.body.id;
    console.log(user);
  
    const filter = { email: user };
    const update = { accepted:'rejected' };
    
    // `doc` is the document _before_ `update` was applied
     User.findOneAndUpdate(filter, update).then((result)=>{
         console.log(result)
     })
     const msg = await defaultD.find({})
     const realMsg = []

     msg.map((one)=>{
         realMsg.push(one.msg1)
     })
     console.log(realMsg[0])
     // send email
     var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'wearechanger@gmail.com',
          pass: '7404225687Dd'
        }
      });
      
      var mailOptions = {
        from: 'wearechanger@gmail.com',
        to: user,
        subject: 'We are changers',
        text: realMsg[0]
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    
    //  const id = req.body.id;
    //  console.log(id)
     
    //  Meeting.remove({email:id}, function(err){
    //     if(err) throw err;
    // });
   
   
    res.redirect('/rejectedU')
})





/////////////////////////////////pending users


/////////////////////////////////accepted users


app.get('/acceptedU',async(req,res)=>{
    const session_n = req.session.adminOrMod
    const data = await User.find({})
    // console.log(data);

    const data1 = []

    data.map((one)=>{
        if(one.accepted==='accepted' ||  one.accepted==='completed') {
                data1.push(one)
        }
    })
        // console.log(data1)
    res.render('acceptedU',{
        data1,session_n
    })



  //  res.render('acceptedU')
})



/////////////////////////////////accepted users


//////////////////////////////  send mail

app.post('/sendingEmail',(req,res)=>{
    const email = req.body.checked;
    const msg = req.body.msg
    console.log(email)
    console.log(msg);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'wearechanger@gmail.com',
          pass: '7404225687Dd'
        }
      });
      
      var mailOptions = {
        from: 'wearechanger@gmail.com',
        to: email,
        subject: 'We are changers',
        text: msg
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });


res.redirect('/groupEmail')


})




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/sendingEmailCopy',(req,res)=>{
    const email = req.body.checked;
    const msg = req.body.msg
    console.log(email)
    console.log(msg);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'wearechanger@gmail.com',
          pass: '7404225687Dd'
        }
      });
      
      var mailOptions = {
        from: 'wearechanger@gmail.com',
        to: email,
        subject: 'We are changers',
        text: msg
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });


res.redirect('/referralP')


})


app.get('/all',(req,res)=>{
    async.concat([User,Meeting],function(model,callback) {
        var query = model.find({});
        query.exec(function(err,docs) {
          if (err) throw err;
          callback(err,docs);
        });
      },
      function(err,result) {
        if (err) throw err;
    
       console.log(result)
      res.send(result)
       
      
      });
      
    
      
})



app.post('/deleteMeetingFromDiss', (req, res) => {
    // var id = req.body.id;

    const user = req.body.id;
    console.log(user);
  
    const filter = { email: user };
    const update = { accepted:'deleted' };
    
    // `doc` is the document _before_ `update` was applied
     User.findOneAndUpdate(filter, update).then((result)=>{
         console.log(result)
         res.redirect('/acceptedU')
     })
    

   
  })


  
app.post('/deleteMeeting', (req, res) => {
    // var id = req.body.id;

    const user = req.body.id;
    console.log(user);
  
    const filter = { email: user };
    const update = { accepted:'deleted' };
    
    // `doc` is the document _before_ `update` was applied
     User.findOneAndUpdate(filter, update).then((result)=>{
         console.log(result)
         res.redirect('/todaysMeeting')
     })
    

   
  })


  app.post('/sendingEmailTodaysMeeting',(req,res)=>{
    const email = req.body.checked;
    const msg = req.body.msg
    console.log(email)
    console.log(msg);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'wearechanger@gmail.com',
          pass: '7404225687Dd'
        }
      });
      
      var mailOptions = {
        from: 'wearechanger@gmail.com',
        to: email,
        subject: 'We are changers',
        text: msg
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });


res.redirect('/todaysMeeting')


})


app.post('/sendingEmailOldMeetings',(req,res)=>{
    const email = req.body.checked;
    const msg = req.body.msg
    console.log(email)
    console.log(msg);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'wearechanger@gmail.com',
          pass: '7404225687Dd'
        }
      });
      
      var mailOptions = {
        from: 'wearechanger@gmail.com',
        to: email,
        subject: 'We are changers',
        text: msg
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });


res.redirect('/oldMeetings')


})




app.post('/sendingEmailDissapproval',(req,res)=>{
    const email = req.body.checked;
    const msg = req.body.msg
    console.log(email)
    console.log(msg);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'wearechanger@gmail.com',
          pass: '7404225687Dd'
        }
      });
      
      var mailOptions = {
        from: 'wearechanger@gmail.com',
        to: email,
        subject: 'We are changers',
        text: msg
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });


res.redirect('/rejectedU')


})



app.post('/sendingEmailApproval',(req,res)=>{
    const email = req.body.checked;
    const msg = req.body.msg
    console.log(email)
    console.log(msg);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'wearechanger@gmail.com',
          pass: '7404225687Dd'
        }
      });
      
      var mailOptions = {
        from: 'wearechanger@gmail.com',
        to: email,
        subject: 'We are changers',
        text: msg
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });


res.redirect('/acceptedU')


})











///////////////////////////////////////////////////////////////////////////////////// default email msg

app.get('/defaultEmail',async(req,res)=>{
    const session_n = req.session.adminOrMod
 var checkU = req.session.moderator;
 const dataM = await defaultMsg.find({})
//console.log(dataM)



 //console.log(checkU);

    const data = await defaultMsg.find({})
console.log(data)

    res.render('defaultEmail',{
        data,checkU,session_n
    })


})


app.get('/defaultEmailforModerator',async(req,res)=>{
    var checkU = req.session.moderator;
    console.log(checkU);
       const dataM = await defaultMsg.find({})
   console.log(dataM)
       res.render('defaultEmailforModerator',{
           dataM,checkU
       })
   })


app.post('/defaultEmail',(req,res)=>{

    const msg = req.body.msg;


 
  
    const filter = { target: "admin" };
    const update = { msg:msg };
    
    // `doc` is the document _before_ `update` was applied
     defaultMsg.findOneAndUpdate(filter, update).then((result)=>{
         console.log(result)
     })

    res.redirect('/defaultEmail')


})


app.get('/defaultEmailAfterBookMeeting',async(req,res)=>{
    const session_n = req.session.adminOrMod
    const data = await defaultMeetingMsg.find({})
    res.render('defaultEmailAfterBookMeeting',{
        data,session_n
    })
})



app.post('/defaultEmailAfterBookMeeting',(req,res)=>{

    const msg = req.body.msg;
    
    const filter = { target: "admin" };
    const update = { msg1:msg };
    
    // `doc` is the document _before_ `update` was applied
    defaultMeetingMsg.findOneAndUpdate(filter, update).then((result)=>{
         console.log(result)
         res.redirect('/defaultEmailAfterBookMeeting')
     })
  


})





app.get('/defaultEmailAfterDissaproving',async(req,res)=>{
    const session_n = req.session.adminOrMod
    const data = await defaultD.find({})
    res.render('defaultEmailAfterDissaproving',{
        data,session_n
    })
})

app.post('/defaultEmailAfterDissaproving',(req,res)=>{

    const msg = req.body.msg;
    const filter = { target: "admin" };
    const update = { msg1:msg };
    

    defaultD.findOneAndUpdate(filter, update).then((result)=>{
         console.log(result)
         res.redirect('/defaultEmailAfterDissaproving')
     })


    // var new1 = new defaultD({
    //     msg1:msg
    // })
  
    // new1.save((one)=>{
    //     console.log(one)
    // })


})












app.get('/defaultEmailAfterApproving',async(req,res)=>{
    const session_n = req.session.adminOrMod
    const data = await defaultA.find({})
    res.render('defaultEmailAfterApproving',{
        data,session_n
    })
})


app.post('/defaultEmailAfterApproving',(req,res)=>{

    const msg = req.body.msg;
    const filter = { target: "admin" };
    const update = { msg1:msg };
    

    defaultA.findOneAndUpdate(filter, update).then((result)=>{
         console.log(result)
         res.redirect('/defaultEmailAfterDissaproving')
     })


    // var new1 = new defaultA({
    //     msg1:msg
    // })
  
    // new1.save((one)=>{
    //     console.log(one)
    // })


})





///////////////////////////////////////////////////////////////////////////////////// default email msg



/////////////////////////////////////////////////////////////   

app.get('/meetingExit',(req,res)=>{
    const username = req.session.session_name;
    console.log(username)
    res.render('meetingExit',{
        username

    })
})



app.get('/adminP',(req,res)=>{
    res.render('adminL')
})


app.get('/moderatorP',(req,res)=>{
    res.render('moderatorL')
})





 app.get('/videoshow',(req,res)=>{
     
     res.render('videoshowcase')
 })



  app.post('/updateU',(req,res)=>{
      const user = req.session.session_name;
        const email = req.body.email;
        const city = req.body.city;
        const state = req.body.state;
        const age = req.body.age;
        const mobile = req.body.mobile;
        const gender = req.body.gender;

 const filter = { email: user };
    const update = { email,city,state,age,mobile,gender

    };
    
    // `doc` is the document _before_ `update` was applied
     User.findOneAndUpdate(filter, update).then((result)=>{
         console.log(result)
     })

     res.redirect('/userDashboard')

  })


  app.post('/updateTU',(req,res)=>{
    const user = req.session.session_name;
      const email = req.body.email;
      const city = req.body.city;
      const state = req.body.state;
      const age = req.body.age;
      const mobile = req.body.mobile;
      const gender = req.body.gender;

const filter = { email: user };
  const update = { email,city,state,age,mobile,gender

  };
  
  // `doc` is the document _before_ `update` was applied
   User.findOneAndUpdate(filter, update).then((result)=>{
       console.log(result)
       res.redirect('/trailDashboard')
   })

 

})


  app.post('/deleteUser', (req, res) => {
    var id = req.body.id;
    User.findByIdAndRemove(id, function (err, deletedStandUp) {
      // handle any potential errors here
      res.redirect('/allusers');        
    });
  })


  app.post('/EditUser', async(req, res) => {
    var id = req.body.id;
console.log(id)
    const data = await User.findOne({ _id: id })
    console.log(data)

    res.render('edituser',{
        data
    })
  

app.post('/EditUserProcess',(req,res)=>{

    const username = req.body.username;
    const email = req.body.email;
    const city = req.body.city;
    const state = req.body.state;
    const age = req.body.age;
    const education = req.body.education;
    const profession = req.body.profession;
    const mobile = req.body.mobile;

    const gender = req.body.gender;

const filter = { email: email };
const update = { email,city,state,age,gender,education,profession,username,mobile

};

// `doc` is the document _before_ `update` was applied
 User.findOneAndUpdate(filter, update).then((result)=>{
     console.log(result)
     res.redirect('/allusers')
 })









    
})

  })



  

 app.get('/jsonToxls',async(req,res)=>{
    const data = await User.find({})
    console.log(data);
  res.xls('data.xlsx', data);
 })




const port = process.env.PORT || 7000
app.listen(port, () => {
  console.log(`Server is running ${port}`)
})
