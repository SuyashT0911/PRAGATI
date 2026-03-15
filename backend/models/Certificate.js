/**
 * PRAGATI — Certificate Model
 */
'use strict';
const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
    user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course:       { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    enrollment:   { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment' },
    certificateId:{ type: String, unique: true }, // e.g. PRAG-2026-CS-00123
    issuedAt:     { type: Date, default: Date.now },
    userName:     { type: String },
    courseName:   { type: String },
    score:        { type: Number }, // overall average quiz score
});

CertificateSchema.index({ user: 1, course: 1 });

module.exports = mongoose.model('Certificate', CertificateSchema);
