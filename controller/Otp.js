const Otp = require("../model/Otp");
const Usermodel = require("../model/user");
const EmailNotification = require("../until/EmailNotification");


const sendOtp = async (req, res) => {

    try {
        const {email,purpose} = req.body;

        console.log("email,purpose",email,purpose)

        if (!email) {
            return res.json({ success: false, message: "Email is required. Please provide an email" })
        }
        const userEmail = email.toLowerCase();


        const existingUser = await Usermodel.findOne({email: userEmail});


        if(purpose === "forgotPassword" ||  purpose === "resetPassword"){
          
        if (!existingUser) {
            return res.json({ success: false, message: "Acoount nil" })
        }
        }
        else{
            if (existingUser) {
            return res.json({ success: false, message: "Acoount exits" })
        }
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        );

        const expiry = new Date(
            Date.now() + 5 * 60 * 1000
        );
        

        const updateotp = await Otp.updateOne(
            {
                email: userEmail
            },
            {
                $set: {
                    otp: otp,
                    expiresAt: expiry
                }
            },
            {
                upsert: true
            }
        );
        if (!updateotp) {
            return res.json({ success: false, message: "Failed to save OTP. Please try again." });
        }

      const html = `
<div style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;">
        <tr>
            <td align="center">

                <table width="100%" cellpadding="0" cellspacing="0"
                    style="max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,0.08);">

                    <!-- Header -->
                    <tr>
                        <td align="center"
                            style="background:linear-gradient(135deg,#0f172a,#1e3a8a);padding:35px 20px;">

                            <h1 style="margin:0;color:#ffffff;font-size:28px;">
                               Shankaeshwari Techonation
                            </h1>

                            <p style="margin-top:8px;color:#dbeafe;font-size:14px;">
                                Learning Management System
                            </p>

                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:40px 30px;text-align:center;">

                            <h2 style="margin:0;color:#111827;font-size:24px;">
                                OTP Verification
                            </h2>

                            <p style="margin-top:15px;color:#4b5563;font-size:15px;line-height:26px;">
                                Use the verification code below to continue your process.
                            </p>

                            <!-- OTP Box -->
                            <div
                                style="margin:35px auto;background:#eff6ff;border:2px dashed #2563eb;border-radius:14px;padding:20px;max-width:280px;">

                                <div style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#1d4ed8;">
                                    ${otp}
                                </div>

                            </div>

                            <p style="margin-top:20px;color:#ef4444;font-size:14px;font-weight:600;">
                                This OTP will expire in 5 minutes.
                            </p>

                            <p style="margin-top:25px;color:#6b7280;font-size:14px;line-height:24px;">
                                If you didn't request this OTP, you can safely ignore this email.
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td
                            style="background:#f9fafb;padding:22px;text-align:center;border-top:1px solid #e5e7eb;">

                            <p style="margin:0;color:#6b7280;font-size:13px;">
                                © 2026 SAN Technovation Pvt. Ltd.
                            </p>

                            <p style="margin-top:8px;color:#9ca3af;font-size:12px;">
                                This is an automated email. Please do not reply.
                            </p>

                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>
</div>
`;

        const isMailSent = await EmailNotification({
            receiverEmail: email,
            subject: "OTP Verification",
            dynamicHtml: html
        })

        if (!isMailSent) {
            return res.status(500).json({ success: false, message: 'Failed to send OTP to Mail! Please contact support Team.' })
        }

        return res.status(201).json({ success: true, message: 'OTP sent sucessfully!' })

    } catch (err) {
        console.log("Error in send OTP:", err);
        return res.status(500).json({success: false,message: "Internal server error"});
    }
};





const Verifyotp = async (req, res) => {
    try {

        const {
            name,
            email,
            enteredOTP,
            password,
            contact,
            age,
            gender,
            address,
            city,
            state,
            role
        } = req.body;


        if (
            !name ||
            !email ||
            !password ||
            !enteredOTP ||
            !contact ||
            !age ||
            !gender ||
            !address ||
            !city ||
            !state ||
            !role
        ) {
            return res.json({
                success: false,
                message: "All fields are required"
            });
        }


        const UserEmail = email.trim().toLowerCase();

        const UserRole = role.trim().toLowerCase();


        // OTP find
        const otpData = await Otp.findOne({
            email: UserEmail
        });


        if (!otpData) {
            return res.json({
                success: false,
                message: "Email not found"
            });
        }


        // OTP check
        if (Number(otpData.otp) !== Number(enteredOTP)) {
            return res.json({
                success: false,
                message: "Invalid OTP"
            });
        }


        // Existing user check
        const existingUser = await Usermodel.findOne({
            email: UserEmail
        });


        if (existingUser) {
            return res.json({
                success: false,
                message: "Email already registered"
            });
        }


        // Create user
        const saveUser = await Usermodel.create({

            name,

            email: UserEmail,

            password,

            contact,

            age,

            gender,

            address,

            city,

            state,

            role: UserRole

        });


        // Delete OTP after successful verification
        await Otp.deleteOne({
            email: UserEmail
        });


        return res.json({
            success: true,
            message: "OTP verification success",
            saveUser
        });


    } catch (err) {

        console.log("VERIFY OTP ERROR:", err);

        return res.json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};



const forgotPassword = async (req, res) => {
    try {
        const { email, otp, newpassword, confirmpassword } = req.body;

        if (!email || !otp || !newpassword || !confirmpassword) {
            return res.json({ success: false, message: "all fields are required " })
        }

        const userEmail = email.toLowerCase();

        const otpData = await Otp.findOne({ email: userEmail });
        console.log("OTP from DB:", otpData);


        if (!otpData) {
            return res.json({ success: false, message: "OTP not found" });
        }

        if (String(otpData.otp) !== String(otp)) {
            return res.json({ success: false, message: "ivalid otp " })
        }

        if (newpassword !== confirmpassword) {
            return res.json({ success: false, message: "Password does not match" });
        }

        const user = await Usermodel.findOne({
            email: {
                $regex: `^${userEmail}$`,
                $options: "i"
            }
        });

        console.log("Searching email:", userEmail);
        console.log("User from DB:", user);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        user.password = newpassword;

        user.role = "user";

        await user.save();

        return res.json({ success: true, message: "Password changed successfully" });

    }
    catch (err) {
        console.log(err.message)
        return res.json({ success: true, message: "network error " })
    }
}


const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "all fields are required !" })
        }

        const user = await Usermodel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "invalid email and password ! " })
        }

        if (user.password !== password) {
            return res.json({ success: false, message: "Invalied email and password" })
        }


        const saveSession = {
            id: String(user._id),
            fullName: user.name,
            email: user.email,
            contact: user.contact,
            role: user.role
        }

        req.session.user = saveSession

        // Save session
        req.session.save((err) => {
            if (err) {
                console.log("Session save error:", err);
                return res.json({ success: false, message: "Session Error, contact your support team" });
            }
            return res.json({ success: true, message: "Login successful", data: saveSession });
        });
    }
    catch (err) {
        return res.json({ success: false, message: " server error" })
    }
}



const resetPassword = async (req, res) => {
    try {

        const { email, otp, currentPassword, newPassword, confirmPassword } = req.body;

        // 1. All fields check
        if (!email || !otp || !currentPassword || !newPassword || !confirmPassword) {
            return res.json({
                success: false,
                message: "All fields are required"
            });
        }

        const userEmail = email.trim().toLowerCase();

        // 2. Check OTP + Email
        const otpData = await Otp.findOne({
            email: userEmail
        });

        console.log("OTP from DB:", otpData);

        if (!otpData) {
            return res.json({
                success: false,
                message: "OTP not found"
            });
        }

        // 3. Check OTP match
        if (String(otpData.otp) !== String(otp)) {
            return res.json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // 4. Find User by Email
        const user = await Usermodel.findOne({
            email: {
                $regex: `^${userEmail}$`,
                $options: "i"
            }
        });

        console.log("User from DB:", user);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        // 5. Check Old Password
        if (user.password !== currentPassword) {
            return res.json({
                success: false,
                message: "Password does not match"
            });
        }



        // 6. Set New Password
        user.password = newPassword;

        if (newPassword !== confirmPassword) {
            return res.json({
                success: false,
                message: "New password and confirm password do not match"
            });
        }

        // 7. Save to Database
        await user.save();

        // 8. Delete OTP after successful password change
        await Otp.deleteOne({
            email: userEmail
        });

        return res.json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};




// const Checkauth = async (req, res) => {
//     try {

//         if (!req.session.user) {
//             return res.json({ success: false, message: "user is does not login!" })
//         }
//         return res.json({ success: true, message: "user login successfully", data: req.session.user })

//     }
//     catch (err) {
//         console.log("checkauth error", err)
//         return res.json({ success: false, message: "something went wrong!" })

//     }

// }







module.exports = {  sendOtp, Verifyotp, login, resetPassword, forgotPassword };
