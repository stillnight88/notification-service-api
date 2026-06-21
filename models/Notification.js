import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required"],
        index: true 
    },
    type: {
        type: String,
        enum: {
            values: ["order", "system", "message", "promotion", "reminder"],  
            message: "Type must be one of: order, system, message, promotion, reminder"
        },
        required: [true, "Notification type is required"],
        index: true 
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [100, "Title cannot exceed 100 characters"]
    },
    message: {
        type: String,
        required: [true, "Message content is required"],
        trim: true,
        maxlength: [500, "Message cannot exceed 500 characters"]
    },
    priority: {
        type: String,
        enum: {
            values: ["low", "medium", "high", "urgent"],
            message: "Priority must be one of: low, medium, high, urgent"
        },
        default: "medium"
    },
    read: {
        type: Boolean,
        default: false,
        index: true // Optimize queries for unread notifications
    },
    readAt: {
        type: Date,
        default: null
    },
    data: {
        type: mongoose.Schema.Types.Mixed, // Flexible data for different notification types
        default: {}
    },
    expiresAt: {
        type: Date,
        default: null,
        index: { expireAfterSeconds: 0 } // TTL index for auto-deletion
    }
}, { 
    timestamps: true, 
    versionKey: false 
});

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 }); // Get user's unread notifications
NotificationSchema.index({ userId: 1, type: 1, createdAt: -1 });  // Get user's notifications by type
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // Auto-delete after 30 days

NotificationSchema.pre('save',function(next){
    if (this.isModified('read') && this.read && !this.readAt) {
        this.readAt = new Date();
    };
    next();
});

NotificationSchema.methods.markAsRead = function() {
    this.read = true;
    this.readAt = new Date();
    return this.save();
};

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;