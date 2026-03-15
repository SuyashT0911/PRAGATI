/**
 * PRAGATI — Progress Model
 * Per-chapter progress for each user
 */
'use strict';
const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chapter:     { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
    course:      { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

    isCompleted: { type: Boolean, default: false },
    quizScore:   { type: Number },
    quizPassed:  { type: Boolean, default: false },
    attempts:    { type: Number, default: 0 },
    completedAt: { type: Date },
    timeSpent:   { type: Number, default: 0 }, // seconds
});

ProgressSchema.index({ user: 1, course: 1 });
ProgressSchema.index({ user: 1, chapter: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);
