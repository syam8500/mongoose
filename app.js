var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require("multer");
var session = require('express-session')
mongoose.promise = require("bluebird");
mongoose.connect('mongodb://localhost/shyam');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var storage =   multer.diskStorage({  
  destination: function (req, file, callback) {  
    callback(null, './public/images');  
  },  
  filename: function (req, file, callback) {  
    callback(null, file.originalname);  
  }  
}); 
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
var upload = multer({storage:storage}).single('file');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
var urlencodeparser = bodyParser.urlencoded({ extended:true });
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(upload);
app.use('/', index);
app.use('/users', users);
//app.use(checkAuth);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//set headers
app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','POST,GET,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type');
    res.setHeader('Access-Control-Allow-Credentials',true);
    next();

})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
 var sID;
// var schema = new mongoose.Schema({
//  uname:String,
//  mail:String,
//  password:String,
//  age:Number,
//  date:Date,
//  file:String
// });
var  schema = new mongoose.Schema({
  fname:String,
  lName:String,
  mail:String,
  password:String

})
var model = mongoose.model('saroj',schema);

//post register page to login page
app.post("/login",urlencodeparser,function(req,res){
  console.log(req.body);
//      var employee = model({
//        uname:req.body.uname,
//        mail:req.body.mail,
//        password:req.body.password,
//        age:"",
//        data:"",
//        file:""
//        //age:req.body.age,
//        //date:req.body.date,
// //file:req.file.filename
//      });
// console.log(req.body);

var employee = model({
    fname:req.body.firstName,
  lName:req.body.lastName,
  mail:req.body.email,
  password:req.body.password
});
   //  model.find({$or:[{uname:req.body.uname},{mail:req.body.mail}]},function(err,data){
     model.find({mail:req.body.email},function(err,data){
       console.log(data);
        if(data[0]!=null){
//res.redirect("/");
         //  res.redirect('/?invalid=' + encodeURIComponent('already registered'));
         console.log("inavalid");
         res.json({data:"invalid"});
        }
        else{
          employee.save(function(err,data){
    if(err){
  throw err;
    }
    else{
      
      console.log("register successful")
      console.log(data);
        //  res.render("login");
        res.json({data:"login"});

    }
  });
        }
      });

});
app.post("/dashboard",function(req,res){
  umail = req.body.email;
  pwd = req.body.password;
 sID = req.sessionID; 
console.log(sID);
console.log(req.sessionID);
 // console.log(uname);
  console.log(pwd);
  model.find({$and:[{mail:umail},{password:pwd}]},function(err,docs){
    console.log(docs);
    if(docs[0] != null){
      // console.log(docs[0]);
      // uname = docs[0].uname;
      // image = docs[0].file;
      res.json({data:"success"});
//res.redirect("/dashboard");

//res.end("successful login");
    }
    else{
//res.redirect("/login");
res.json({data:"inavlid"});
// res.redirect('/login?invalid=' + encodeURIComponent('Incorrect Email or Password'));
    }
  });

});
app.get("/logout",function(req,res){
// delete sID;
req.session.destroy(function(err,data){
  if(err) throw err
  else {
    sID = undefined;
    console.log(sID);
    res.redirect("/login");
  }
});
// sID =undefined;
// console.log(sID);
  // res.redirect('/login');
});
app.get('/dashboard',checkAuth, function (req, res) {
   res.render("dashBoard",{uname:uname,image:image});
 // res.send('if you are viewing this page it means you are logged in');
});
function checkAuth(req, res, next) {
  console.log(sID);
  if (!sID) {
    res.send('You are not authorized to view this page');
  } else {
    next();
  }
}
var port = "3003";
app.set('port', port);
app.listen(3003);
module.exports = app;


