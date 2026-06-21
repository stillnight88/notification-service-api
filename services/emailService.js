import nodemailer from 'nodemailer';
import validator from "validator";
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = () => {
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email configuration missing. Check EMAIL_HOST, EMAIL_USER, EMAIL_PASS environment variables.');
    };

    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateDelta: 1000,
        rateLimit: 5
    });
};

const transporter = createTransporter();


export const testConnection = async () => {
    try {
        await transporter.verify();
        console.log("Email server connection successful");
    } catch (error) {
        console.error("Email server connection failed:", error.message);
        process.exit(1);
    }
};

const sendEmail = async ({ to, subject, html, text = null }) => {
    try {
        if (!to || !subject || !html) {
            throw new Error('Missing required fields: to, subject, and html are required');
        }

        if (!validator.isEmail(to)) {
            throw new Error('Invalid email format');
        }

        const mailOptions = {
            from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
            to,
            subject,
            html,
            text: text || html.replace(/<[^>]*>/g, ''), 
        };

        const result = await transporter.sendMail(mailOptions);

        console.log(`Email sent successfully to ${to}. Message ID: ${result.messageId}`);
        return { success: true, messageId: result.messageId };

    } catch (error) {
        console.error('Email sending failed:', error.message);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

export default sendEmail;