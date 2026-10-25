import nodemailer from "nodemailer";
import { config } from "../config/config.js";

/**
 * A tranporter instance must be created using the nodemailer library. 
 * The transporter is the one that helps the communication between our web server and SMTP server. 
 * SMTP server is the one that actually sends the email to an email address. 
 * Mandatory requirements for SMT server: user, client id, client secret, refresh token
*/
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: config.GOOGLE_USER,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        refreshToken: config.GOOGLE_REFRESH_TOKEN,
        clientId: config.GOOGLE_CLIENT_ID
    }
});

transporter.verify()
  .then(() => {console.log("Email transporter is ready to send email")})
  .catch((err) => {console.log("Email transporter verification failed: ", err)}); 

type MailPayload = {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({to, subject, html}: MailPayload){
    const mailOptions = {
        from: config.GOOGLE_USER, 
        to,
        subject,
        html
    };

    const details = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", details);
}  