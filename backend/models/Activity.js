'use strict';
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['registration', 'login', 'enrollment', 'certificate', 'profile_update', 'course_created', 'course_deleted', 'user_created', 'user_deleted'],
        required: true,
    },
    message: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    meta: { type: mongoose.Schema.Types.Mixed }, // extra data
}, {
    timestamps: true,
});

activitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
