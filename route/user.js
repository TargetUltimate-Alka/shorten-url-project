const express = require("express");
const { handleUserSignup, handleUserLogin, handleUserLogout } = require("../controller/user");

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/register", handleUserSignup);

router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", handleUserLogin);

router.get("/logout", handleUserLogout);

module.exports = router;