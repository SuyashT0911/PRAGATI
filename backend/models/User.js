/**
 * PRAGATI — User Model
 */
'use strict';
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName:    { type: String, required: true, trim: true },
    lastName:     { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role:         { type: String, enum: ['student', 'admin'], default: 'student' },
    eduLevel:     { type: String },
    avatar:       { type: String },
    createdAt:    { type: Date, default: Date.now },
});

UserSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

UserSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);
