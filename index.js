const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();
app.use(express.static(__dirname + "/public"));
// passport config
require("./config/passport")(passport);
// Db config
const db = require("./config/keys").MongoURL;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true
};

// connect to Mongo

mongoose
  .connect(db, options) // This will return a promise
  .then(() => console.log("MangoDB Connected..."))
  .catch(err => {
    console.log(err);
  });

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Bodyparser

app.use(express.urlencoded({ extended: false }));

// Express Session
const sessions = {
  secret: "keyboard cat",
  resave: true,
  saveUninitialized: true
};

app.use(session(sessions));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// to check if the user is signed in
app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  next();
});

// Connect flash
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes

app.use("/", require("./routes/index"));
// users Route
app.use("/user", require("./routes/user"));
// creating port
const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
