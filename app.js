require('dotenv').config();
const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/userDB',{useNewUrlParser: true, useUnifiedTopology: true});
const userSchema=new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    minlength: 8,
    required: true
  }
});
userSchema.plugin(encrypt,{secret: process.env.SECRET,encryptedFields: ['password']});
const User=mongoose.model("User",userSchema);
app.post("/register",function(req,res){
  const user=new User({
    email: req.body.username,
    password: req.body.password
  });
  user.save(function(err){
    if(err)
    res.send(err);
    else
    res.render("secrets");
  });
});
app.post("/login",function(req,res){
  User.findOne({email: req.body.username},function(err,user){
    if(err)
    res.send(err);
    else
    {
      if(!user)
      res.send("Wrong email");
      else{
        if(user.password === req.body.password)
        res.render("secrets");
        else
        res.send("Wrong password");
      }
    }
  });
});
app.get("/",function(req,res){
  res.render("home");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.get("/login",function(req,res){
  res.render("login");
});



app.listen(process.env.PORT || 3000,function(){
  console.log("Server running");
});
