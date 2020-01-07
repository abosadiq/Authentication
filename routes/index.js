const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../config/auth");
// create a route
// welcome page
router.get("/", (reg, res) => {
  res.render("home");
});
// dashboard page
router.get("/dashboard", ensureAuth, (req, res) => {
  res.render("dashboard", {
    name: req.user.name
  });
  // console.log(req.user.name);
});
// to import it in other files
module.exports = router;
