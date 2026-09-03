const nodemailer = require("nodemailer");

const EmailNotification = async ({
    receiverEmail,
    subject,
    dynamicHtml
}) => {

      try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "abivengadajalam7708@gmail.com", 
                pass: "htqz xbjb lrzw plcm"     
            }
        });

          const mailOptions = {
            from: `"abi LMS" <abivengadajalam7708@gmail.com>`,
            to: `<${receiverEmail}>`,
            subject: subject,
            html: `
                <div style="font-family:Arial,sans-serif;padding:20px;">
                    ${dynamicHtml}
                </div>
            `
        };
        
        const response = await transporter.sendMail(mailOptions);
        console.log("Email Sent Successfully:", response.messageId);
        return true;

    }
    catch (err) {
        console.log("Error Sending Email:", err);
        return false;
    }
};

module.exports = EmailNotification;