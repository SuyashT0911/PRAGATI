/**
 * PRAGATI — Enrollment Model
 * Tracks which user is enrolled in which course
 */
'use strict';
const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
    user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course:          { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    enrolledAt:      { type: Date, default: Date.now },
    completedAt:     { type: Date },
    overallProgress: { type: Number, default: 0 }, // 0-100%
    isCompleted:     { type: Boolean, default: false },
});

EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
