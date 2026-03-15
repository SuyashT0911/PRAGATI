/**
 * PRAGATI — Chapter Model
 * Individual learning units within a course
 */
'use strict';
const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
    course:          { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

    title:           { type: String, required: true },
    slug:            { type: String },
    order:           { type: Number, required: true },

    // Content (stored as Markdown)
    content:         { type: String, default: '' },
    summary:         { type: String },

    // Learning aids
    videoUrl:        { type: String },
    codeExamples:    [{
        language: String,
        code: String,
        title: String,
    }],
    resources:       [{
        title: String,
        url: String,
        type: { type: String, enum: ['article', 'video', 'pdf', 'link'] },
    }],

    // Time
    readTimeMinutes: { type: Number, default: 10 },

    // Unlocking
    isLocked:        { type: Boolean, default: true },

    // Quiz (embedded for simplicity)
    quiz: {
        questions: [{
            question:      { type: String },
            options:       [String],
            correctAnswer: { type: Number }, // index 0-3
            explanation:   { type: String },
        }],
        passingScore: { type: Number, default: 70 },
    },

    isPublished:     { type: Boolean, default: true },
    createdAt:       { type: Date, default: Date.now },
});

ChapterSchema.index({ course: 1, order: 1 });

module.exports = mongoose.model('Chapter', ChapterSchema);
