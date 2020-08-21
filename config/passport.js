const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model
const User = require('../models/user');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'useremail', passwordField: 'userpass'}, (useremail, userpass, done) =>{
          // Match User
          User.findOne({useremail: useremail})
          .then(user =>{
              if(!user){
                  return done(null, false, {message: 'The email is not registered'} );
              }

            // Match Password
            bcrypt.compare(userpass, user.userpass, (err, isMatch)=>{
                if(err) throw err;
                if(isMatch){

                    return done(null, user);
                }
                else {
                    done(null, false, {message: 'Password incorrect'});
                }
            });

          })
          .catch(err => console.log(err));  
        })
    );
    
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
  
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });
}