const express = require("express");

const {sendOtp , VerifyOtp, forgotPassword, login} = require("../controller/Otp")

const router = express.Router();

router.post("/send-otp",sendOtp)
router.post("/Verify-Otp",VerifyOtp)
router.post("/forgot-Password",forgotPassword)
router.post("/login",login)


module.exports = router;