const express = require('express');
const AuthRouter = express.Router();
const generateToken = require('../modules/module.GenerateJwtToken')
const cors = require('cors')
// user model
const UserModel = require('../models/model.user')

var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const session = require('express-session')

AuthRouter.use(session({ secret:process.env.Session_Secret_Key, resave: false, saveUninitialized: true }));
AuthRouter.use(passport.initialize());
AuthRouter.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.Google_Auth_ClientId,
    clientSecret: process.env.Google_Auth_Client_Secret,
    callbackURL: `https://dell-india-full-stack.onrender.com/login/auth/google/callback`
  },
  async function(accessToken, refreshToken, profile, cb) {
    const email = profile.emails[0].value;
    try {
      let findUser = await UserModel.findOne({email:email});
      if(!findUser) {
        const user = await UserModel.create({name:profile.displayName,googleId:profile.id,email:email});
        return cb(null,user)
      } else {
        return cb(null,findUser)
      }
    } catch(error) {
      return cb(error)
    }
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user.googleId);
}); // for store session state 

passport.deserializeUser(async function(id, cb) {
  const user = await UserModel.findOne({googleId:id});
  cb(null, user);
}); // for retrive user from the session by using 

AuthRouter.use(cors({
  origin: ['http://localhost:4000', 'http://localhost:5173','https://dell-india.netlify.app/'],
  credentials: true,
}));

AuthRouter.get('/auth/google',
passport.authenticate('google', { scope: ['profile','email'] }))

AuthRouter.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/error' }),
    function(req, res) {
      try {
        const {name,email} = req.user;
        const firstName = name.split(' ')[0];
        const token = generateToken({id:req.user._id});
        /*res.status(200).json({message:"Login Successful",token,name:firstName,email})*/
         const production = `https://dell-india.netlify.app?token=${token}`;
        const development = `http://localhost:5173?token=${token}`
        res.redirect(development)
      }catch(e) {
       res.status(500).json({message:"Internal server Error"})
      }
    });

AuthRouter.get('/error',(req,res)=>{
  res.end('error')
})

AuthRouter.get('/error',(req,res)=>{
  res.status(404).json({message:"Bad Request"})
})


module.exports = AuthRouter;