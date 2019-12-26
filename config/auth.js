module.exports = {
  ensureAuth: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please login or create an account");
    res.redirect("/");
  }
};
