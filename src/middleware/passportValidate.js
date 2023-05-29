const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
const User = require('../models/userModel');
passport.use(new GoogleStrategy({
        clientID : process.env.GOOGLE_AUTH_CLIENTID,
        clientSecret : process.env.GOOGLE_AUTH_CLIENT_SECRET,
        callbackURL : "http://localhost:8000/user/v1/google/callback"
    },
    async function(accessToken, refreshToken, profile, cb) {
        try {
            const user = await User.findOrCreate(
            {
                googleId: profile.id,
                name: profile.displayName, 
                email: profile.emails[0].value,
            }
            );
            return cb(null, user);
        } catch (err) {
            return cb(err);
        }
    }
))

module.exports = passport;