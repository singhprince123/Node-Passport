const LocalStartegy = require('passport-local').Strategy;
const moongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const User = require('../models/users');


module.exports = function(passport) {
    passport.use(
        new LocalStartegy( { usernameField: 'email'}, (email , password, done) => {
            //Match User
            User.findOne({ email: email} )
            .then( user => {
                if(!user){
                    return done(null , false, { message: 'That email is not Register'})
                }

                //Match password
                bcrypt.compare( password, user.password, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch){
                        return done(null, user);
                    }else {
                        return done(null , false, {message: 'Password incorrect'});
                    }
                })
            })
            .catch( err => console.log(err));
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
    passport.deserializeUser((id, done) => {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}

