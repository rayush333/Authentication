require('dotenv').config();
const bcrypt=require('bcrypt');
const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption');
const saltrounds=10;
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
const User=mongoose.model("User",userSchema);
app.post("/register",function(req,res){
  bcrypt.hash(req.body.password,saltrounds,function(err,hash){
    if(err)
    console.log(err);
    else
    {
      const user=new User({
        email: req.body.username,
        password: hash
      });
      user.save(function(err){
        if(err)
        console.log(err);
        else
        res.render("secrets");
      });
    }
  });
});
app.post("/login",function(req,res){
  User.findOne({email: req.body.username},function(err,user){
    if(err)
    console.log(err);
    else
    {
      if(!user)
      res.send("Wrong email");
      else
      {
        bcrypt.compare(req.body.password,user.password,function(err,result){
          if(err)
          console.log(err);
          else
          {
            if(result===true)
            res.render("secrets");
            else
            res.send("Wrong password");
          }
        });
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
