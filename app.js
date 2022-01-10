//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

// console.log(process.env.API_KEY);

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email:String,
  password:String
});

//////////////////////Authentication////////////////////////

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/login", function(req, res){

  const reqEmail = req.body.username;
  const reqPassword = req.body.password;
  User.findOne({email:reqEmail}, function(err, foundUser){
    if(!err){
      if(foundUser.password===reqPassword){
        res.render("secrets");
      } else {
        console.log("Wrong Password");
      }
    } else {
      console.log(err);
    }
  });
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    } else{
      console.log(err);
    }
  });
});

app.listen(3000, function(){
  console.log("Server started at port 3000");
});
