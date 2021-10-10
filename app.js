//jshint esversion:6
require('dotenv').config()     // dotenv import
const express = require("express");
var _ = require('lodash');
const mongoose = require("mongoose"); //DB
const ejs = require("ejs");
const encrypt = require("mongoose-encryption")

const app = express();
console.log(process.env.API_KEY + " and "+ process.env.SECRET);
// body parser
// app.use(express.static(__dirname));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
// body parser
//ejs
app.set('view engine', 'ejs');
//ejs
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});

const userSchema = new mongoose.Schema({    // a part of encrypt added at new mongoose.Schema
  email: String,
  password: String
});

// The part that encrypt secret added


userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ["password"]});
// The part that encrypt secret added

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
res.render("home");
});

app.get("/login",function(req,res){
res.render("login");
});

app.post("/login",function(req,res){
const username = req.body.username ;
const password = req.body.password;

User.findOne({email:username},function(err,foundUser){
if (err){
  console.log(err);
}else{
  if(foundUser){
    if(foundUser.password === password){
      res.render("secrets");
    }else{
      res.send("Wrong password please try again.");
    }
  }else{
    res.send("Wrong username please try again.")
  }
}
});
});

app.get("/logout",function(req,res){
res.render("home");
});

app.get("/register",function(req,res){
res.render("register");
});

app.post("/register",function(req,res){
const newUser = new User(
  {
  email: req.body.username,
  password:req.body.password
}
);
newUser.save(function(err){
  if(err){
    console.log(err);
  }else{
    res.render("secrets");
  }
});
});



app.listen(process.env.PORT || 3000, function() {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
