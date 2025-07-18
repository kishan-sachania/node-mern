const express = require("express");
const path = require("path");
const router = express.Router();
const {
  register_user,
  login_user,
  send_otp,
} = require("../controllers/UserController/userController");

router.post("/register", register_user);

router.post("/login", login_user);

router.get("/otp-demo", (req, res) => {
  res.send("OTP system is integrated and working.");
});

router.get("/otp-demo/fast2sms_verify.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/fast2sms_verify.txt"));
});

router.post("/otp", send_otp);

module.exports = router;
