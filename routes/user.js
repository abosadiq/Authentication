const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Usr Model
const User = require("../models/User");

// create a route for login page

router.get("/login", (reg, res) => {
  res.render("login");
});

//create a route for create acount page
router.get("/register", (reg, res) => {
  res.render("register");
});

// Handling resgisteration

router.post("/register", (req, res) => {
  const { name, email, password, repeatPassword } = req.body;
  let errors = [];
  // Check reqiures fields
  if (!(email || email || password || repeatPassword)) {
    errors.push({ message: "Please fill in all fields" });
  }
  // Check password length

  if (password.length > 8) {
    errors.push({ message: "password should be at least 8 characters" });
  }

  // Check password match
  if (password !== repeatPassword) {
    errors.push({ message: `password don't match` });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      repeatPassword
    });
  } else {
    // When Validation passes
    User.findOne({ email: email }).then(usr => {
      if (usr) {
        // If user already exist
        errors.push({ message: "This email is been used " });
        res.render("register", {
          errors,
          name,
          email,
          password,
          repeatPassword
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        // console.log(newUser);
        // res.send("hello");

        // Hash password
        bcrypt.genSalt(15, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // set the password to hash
            newUser.password = hash;
            //  Save the User
            newUser
              .save()
              .then(usr => {
                req.flash("success_msg", "You are now registered");
                res.redirect("/user/login");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/user/login",
    failureFlash: true
  })(req, res, next);

  // Logout handle

  router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/");
  });
});

// to import it in other files
module.exports = router;
