import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // e.g., 'smtp.gmail.com' for Gmail
    service: 'Gmail',
    port: 587, // or 465 for secure connections
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.APP_EMAIL, // your email
      pass: process.env.APP_EMAIL_PASSWORD, // your password or app-specific password
    },
});

export default transporter;