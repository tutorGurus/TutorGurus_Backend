const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
const User = require('../models/userModel');

passport.use('google-teacher',new GoogleStrategy({
        clientID : process.env.GOOGLE_AUTH_CLIENTID,
        clientSecret : process.env.GOOGLE_AUTH_CLIENT_SECRET,
        callbackURL : "http://localhost:8000/user/v1/T/google/callback"
    },
    async function(accessToken, refreshToken, profile, cb) {
        try {
            console.log(profile)
            const user = await User.findOrCreate(
            {
                googleId: profile.id,
                name: profile.displayName, 
                email: profile.emails[0].value,
                role : 'T'
            }
            );
            return cb(null, user);
        } catch (err) {
            return cb(err);
        }
    }
))

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