const express = require("express");

const {sendOtp , VerifyOtp, forgotPassword, login,  resetPassword} = require("../controller/Otp")

const router = express.Router();

router.post("/send-otp",sendOtp)
router.post("/Verify-Otp",VerifyOtp)
router.post("/forgot-Password",forgotPassword)
router.post("/login",login)
router.post("/reset-Password", resetPassword)


module.exports = router;