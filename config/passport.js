const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Local User Model
const User = require("../models/User");

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match the User
      User.findOne({ email: email })
        .then(usr => {
          if (!usr) {
            return done(null, false, { message: "This email is not register" });
          }
          // password match
          bcrypt.compare(password, usr.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, usr);
            } else {
              return done(null, false, { message: "password is not correct" });
            }
          });
        })
        .catch(err => {
          Console.log(err);
        });
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
