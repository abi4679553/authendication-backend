const express = require("express");

const {sendOtp , VerifyOtp, forgotPassword} = require("../controller/Otp")






const router = express.Router();

router.post("/send-otp",sendOtp)
router.post("/Verify-Otp",VerifyOtp)
router.post("/forgot-Password",forgotPassword)



module.exports = router;