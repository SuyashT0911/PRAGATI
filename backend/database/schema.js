/**
 * PRAGATI — Database Schemas (MongoDB / Mongoose)
 * ─────────────────────────────────────────────────
 * Defines all data models for the application.
 *
 * Collections:
 *   users       → Student & admin accounts
 *   paths       → Education paths data
 *   courses     → Course content & chapters
 *   enrollments → User ↔ Course relationship
 *   progress    → Chapter completion tracking
 *   certificates → Earned certificates
 */

'use strict';

// const mongoose = require('mongoose');

// ── User Schema ─────────────────────────────────────────────────
// const UserSchema = new mongoose.Schema({
//     firstName:    { type: String, required: true, trim: true },
//     lastName:     { type: String, required: true, trim: true },
//     email:        { type: String, required: true, unique: true, lowercase: true },
//     passwordHash: { type: String, required: true },
//     role:         { type: String, enum: ['student', 'admin'], default: 'student' },
//     eduLevel:     { type: String },   // 10th, 12th-science, diploma, etc.
//     avatar:       { type: String },
//     createdAt:    { type: Date, default: Date.now },
// });

// ── Path Schema ─────────────────────────────────────────────────
// const PathSchema = new mongoose.Schema({
//     title:        { type: String, required: true },
//     subtitle:     { type: String },
//     level:        { type: String, required: true }, // 10th, 12th-science, etc.
//     stream:       { type: String },                  // science, commerce, arts...
//     category:     { type: String },
//     duration:     { type: String },
//     salary:       { type: String },
//     description:  { type: String },
//     eligibility:  [String],
//     topColleges:  [String],
//     entranceExams:[String],
// });

// ── Enrollment Schema ───────────────────────────────────────────
// const EnrollmentSchema = new mongoose.Schema({
//     user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     course:       { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
//     enrolledAt:   { type: Date, default: Date.now },
//     completedAt:  { type: Date },
//     progress:     { type: Number, default: 0 },  // 0-100%
// });

// module.exports = {
//     User:       mongoose.model('User', UserSchema),
//     Path:       mongoose.model('Path', PathSchema),
//     Enrollment: mongoose.model('Enrollment', EnrollmentSchema),
// };
