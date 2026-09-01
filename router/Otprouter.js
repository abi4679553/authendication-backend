const express = require("express");

const {sendOtp , VerifyOtp} = require("../controller/Otp")






const router = express.Router();

router.post("/send-otp",sendOtp)
router.post("/Verify-Otp",VerifyOtp)



module.exports = router;