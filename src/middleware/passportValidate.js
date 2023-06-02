const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
const User = require('../models/userModel');
<<<<<<< HEAD
if(process.env.NODE_ENV.trim() === 'dev'){
    passport.use(new GoogleStrategy({
=======

passport.use('google-teacher',new GoogleStrategy({
>>>>>>> dev
        clientID : process.env.GOOGLE_AUTH_CLIENTID,
        clientSecret : process.env.GOOGLE_AUTH_CLIENT_SECRET,
        callbackURL : "http://localhost:8000/user/v1/T/google/callback"
    },
    async function(accessToken, refreshToken, profile, cb) {
        try {
            console.log(profile.photos[0].value);
            const user = await User.findOrCreate(
            {
                googleId: profile.id,
                name: profile.displayName, 
                email: profile.emails[0].value,
<<<<<<< HEAD
                profile_image : profile.photos[0].value
=======
                role : 'T'
>>>>>>> dev
            }
            );
            return cb(null, user);
        } catch (err) {
            return cb(err);
        }
    }
))
  } else {
        passport.use(new GoogleStrategy({
            clientID : process.env.GOOGLE_AUTH_CLIENTID,
            clientSecret : process.env.GOOGLE_AUTH_CLIENT_SECRET,
            callbackURL : "https://tutorgurus-backend.onrender.com/user/v1/google/callback"
        },
        async function(accessToken, refreshToken, profile, cb) {
            try {
                const user = await User.findOrCreate(
                {
                    googleId: profile.id,
                    name: profile.displayName, 
                    email: profile.emails[0].value,
                    profile_image : profile.photos[0].value
                }
                );
                return cb(null, user);
            } catch (err) {
                return cb(err);
            }
        }
    ))
  }


passport.use('google-student',new GoogleStrategy({
    clientID : process.env.GOOGLE_AUTH_CLIENTID,
    clientSecret : process.env.GOOGLE_AUTH_CLIENT_SECRET,
    callbackURL : "http://localhost:8000/user/v1/S/google/callback"
},
async function(accessToken, refreshToken, profile, cb) {
    try {
        console.log(profile)
        const user = await User.findOrCreate(
        {
            googleId: profile.id,
            name: profile.displayName, 
            email: profile.emails[0].value,
            role : 'S'
        }
        );
        return cb(null, user);
    } catch (err) {
        return cb(err);
    }
}
))

module.exports = passport;