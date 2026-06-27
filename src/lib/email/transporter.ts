import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    // Disable strict SSL verification to fix "self-signed certificate in certificate chain" errors
    // often caused by local antivirus software (Avast, Kaspersky, etc.) intercepting emails.
    rejectUnauthorized: false
  }
});
