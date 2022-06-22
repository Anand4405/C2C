//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app = express();
<% if (locals.user._id=!item.loaneeID && item.status!="completed"){ %>
  <% } %>

  <p>  <%=item.loaneeID%> hg </p>
  <p> <%=locals.user._id%>  oj </p>
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


//mongoose.set("useCreateIndex", true);

//loan schema for record of each loan
// const loanSchema = new mongoose.Schema ({
//   loanee: String,
//   accNo : String,
//   amount : String,
//   tenure : String,
//   interest : String,
//   lender : String,
// });

// const userSchema = new mongoose.Schema ({
//   email: String,
//   password: String,
//   googleId: String,
//   bankDetails:{name:String,accNo:String,ifsc:String,email:String,num:String},
//   documets: String,
//   loanApplied: [loanSchema],//loan
//   loanGiven: [loanSchema]//loan
// });


// userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);
const Loan = new mongoose.model("Loan",loanSchema); //model for loan

//authentication stuff:-
passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:80/auth/google/c2c",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {


    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

// app.get("/", function(req, res){
//   res.render("home");
// });
app.use('/',require('./routes'));

// app.get("/auth/google",
//   passport.authenticate('google', { scope: ["profile"] })
// );
//
// app.get("/auth/google/c2c",
//   passport.authenticate('google', { failureRedirect: "/login" }),
//   function(req, res) {
//
//     res.redirect("/loan");
//   });



//login page
app.get("/login", function(req, res){
  res.render("login");
});

//registarion page
app.get("/register", function(req, res){
  res.render("register");
});

//home page access home page is named loan
app.get("/loan", function(req, res){
  User.find({"secret": {$ne: null}}, function(err, foundUsers){
    if (err){
      console.log(err);
    } else {
      if (foundUsers) {
        //console.log("login")
        console.log(req["user"]);
        res.render("loan");
      }
    }
  });
});

//navbar-About
app.get("/about", function(req, res){
  console.log(req["user"]);
  res.render("about");
});

//navbar-profile
app.get("/profile", function(req, res){
  res.render("profile");
});

//navbar history
app.get("/history", function(req, res){
  res.render("history");
});

//navbar-logout button
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

app.get("/giveLoan", function(req, res){
  res.render("giveLoan");
});

app.get("/applyLoan", function(req, res){
  res.render("applyLoan");
});


//registration save
app.post("/register", function(req, res){

  User.register({username: req.body.username},req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/loan");
      });
    }
  });
});

//login
app.post("/login", function(req, res){

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/loan");
      });
    }
  });

});

//saving bank Details
app.post("/bankDetails",function(req,res,next){
   //var id = req["user"]._id;
   console.log(req["user"]);
   User.findById(id,function(err,user){
     if(err){
       console(err);
     }
     else{
       user.bankDetails.name=req.body.name;
       user.bankDetails.accNo=req.body.accNo;
       user.bankDetails.ifsc=req.body.ifsc;
       user.bankDetails.email=req.body.email;
       user.bankDetails.num=req.body.num;
     }
   });

  });
//saving bank Doc
app.post("/bankDoc",function(req,res){



    });

//saving details of loan to be applied
app.post("/applyLoan",function(req,res){

});



app.listen(80, function() {
  console.log("Server started on port 80.");
});
