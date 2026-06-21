import mongoose from 'mongoose';
import Notification from "../models/Notification.js";
import sendEmail from "../services/emailService.js";
import User from "../models/User.js";

export const triggerNotification = async ({
    userId,
    type,
    title,
    message,
    priority = 'medium',
    data = {},
    sendEmailNotification = true
}) => {
    try {
        if (!userId || !type || !title || !message) {
            throw new Error('Missing required fields: userId, type, title, and message are required');
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID format');
        }

        const [notification, user] = await Promise.all([
            Notification.create({
                userId,
                type,
                title,
                message,
                priority,
                data
            }),
            User.findById(userId).select('email')
        ]);

        if (!user) {
            console.warn(`User ${userId} not found, but notification was saved`);
            return { success: true, notificationId: notification._id, emailSent: false };
        }

        let emailSent = false;

        if (sendEmailNotification && user.email ) {
            try {
                const emailResult = await sendEmail({
                    to: user.email,
                    subject: title,
                    html: createEmailTemplate(title, message, type)
                });
                emailSent = emailResult.success;
            } catch (emailError) {
                console.error(`Failed to send email to ${user.email}:`, emailError.message);
            }
        }

        console.log(`✅ Notification triggered for user ${userId}, email sent: ${emailSent}`);

        return {
            success: true,
            notificationId: notification._id,
            emailSent
        };

    } catch (error) {
        console.error("❌ Failed to trigger notification:", error.message);
        throw error; // Re-throw so calling code can handle
    }
};


const createEmailTemplate = (title, message, type) => {
    const typeColors = {
        order: '#28a745',
        system: '#007bff', 
        message: '#17a2b8',
        promotion: '#fd7e14',
        reminder: '#6c757d'
    };

    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: ${typeColors[type] || '#6c757d'}; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">${title}</h1>
            </div>
            <div style="padding: 20px; background-color: #f8f9fa;">
                <p style="font-size: 16px; line-height: 1.5; margin: 0;">${message}</p>
            </div>
            <div style="padding: 10px; text-align: center; font-size: 12px; color: #6c757d;">
                <p>This is an automated notification. Please do not reply to this email.</p>
            </div>
        </div>
    `;
}