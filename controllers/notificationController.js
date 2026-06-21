import Notification from "../models/Notification.js";
import { sendErrorResponse, sendSuccessResponse, validateObjectId } from "../utils/responseHelpers.js"

export const getNotifications = async (req, res) => {
    try {
        const { id } = req.user;
        const notification = await Notification.find({userId : id}).sort({ createdAt: -1 }).lean();;
        console.log(notification)
        return sendSuccessResponse(res, 201, 'fetch notifications successfully', {
            notification
        });
    } catch (error) {
        console.error("Failed to fetch notifications: ", error);
        return sendErrorResponse(res, 500, "Failed to fetch notifications");
    }
}

export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.id

        if (!validateObjectId(id)) {
            return sendErrorResponse(res, 400, "Invalid notification ID format");
        }
        const notification = await Notification.findOne({
            _id: id,
            userId
        });

        if (!notification) {
            return sendErrorResponse(res, 404, "Notification not found");
        };

        await notification.markAsRead();
        return sendSuccessResponse(res, 201, "Marked as read");

    } catch (error) {
        console.error("Failed to fetch notifications: ", error);
        return sendErrorResponse(res, 500, "Failed to update notification");
    }
};

export const markAllAsRead = async (req,res) => {
    try {
        const userId = req.user.id;
        const result = await Notification.updateMany(
            {
                userId,
                read: false
            },
            {
                read: true
            }
        )
        return sendSuccessResponse(res, 200, `All notifications marked as read`, {
            updatedCount: result.modifiedCount
        });

    } catch (error) {
        console.error("Failed to mark all notifications as read:", error);
        return sendErrorResponse(res, 500, "Failed to update notifications");
    }
};
