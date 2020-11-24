require('dotenv').config();
const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption');
const session=require('express-session');
const passport=require('passport');
const passportLocalMongoose=require('passport-local-mongoose');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(session({
  secret: "modijikimaakichutteenbaaramitshahkibhaikibhosdi",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect('mongodb://localhost:27017/userDB',{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex',true);
const userSchema=new mongoose.Schema({
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    minlength: 8,
  }
});
userSchema.plugin(passportLocalMongoose);
const User=mongoose.model("User",userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.get("/secrets",function(req,res){
  if(req.isAuthenticated())
    res.render("secrets");
    else
    res.redirect("/");
});
app.post("/register",function(req,res){
    User.register({username: req.body.username},req.body.password,function(err,user){
      if(err)
      {
      console.log(err);
      res,redirect("/register");
      }
      else
      {
        passport.authenticate("local")(req,res,function(){
          res.redirect("/secrets");
        });
      }
    });
});
app.post("/login",function(req,res){
    const user=new User({
      username: req.body.username,
      password: req.body.password
    });
    req.login(user,function(err){
      if(err)
      res.send("Wrong credentials");
      else
      {
        passport.authenticate('local')(req,res,function(){
          res.redirect('/secrets');
        });
      }
    })
});
app.get("/",function(req,res){
  if(req.isAuthenticated())
  {
    res.redirect("/secrets");
  }
  else
  res.render("home");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.get("/login",function(req,res){
  res.render("login");
});
app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/login");
});


app.listen(process.env.PORT || 3000,function(){
  console.log("Server running");
});
