/**
 * PRAGATI — Course Model
 * Central entity for the learning system
 */
'use strict';
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title:          { type: String, required: true },
    slug:           { type: String, unique: true, required: true },
    stream:         { type: String, required: true },       // 'cs', 'mechanical', 'commerce', etc.
    degree:         { type: String, required: true },       // 'btech', 'bcom', 'mbbs', etc.
    university:     { type: String, default: 'universal' }, // 'mu', 'sppu', 'universal'
    universalTopic: { type: String },                       // shared topic key across universities

    // Metadata
    semester:       { type: Number },
    year:           { type: Number },
    credits:        { type: Number },
    difficulty:     { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },

    // Content
    description:    { type: String },
    thumbnail:      { type: String },
    icon:           { type: String, default: '📖' },
    totalChapters:  { type: Number, default: 0 },
    estimatedHours: { type: Number },

    // Tagging
    tags:           [String],
    category:       { type: String },  // 'Technology', 'Business', 'Design', 'Science', 'Medical'

    // Status
    isPublished:    { type: Boolean, default: true },
    isFeatured:     { type: Boolean, default: false },
    enrollCount:    { type: Number, default: 0 },
    rating:         { type: Number, default: 0 },
    ratingCount:    { type: Number, default: 0 },

    createdAt:      { type: Date, default: Date.now },
    updatedAt:      { type: Date, default: Date.now },
});

// Auto-update timestamp
CourseSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Index for searching
CourseSchema.index({ title: 'text', description: 'text', tags: 'text' });
CourseSchema.index({ stream: 1, degree: 1, university: 1 });
CourseSchema.index({ slug: 1 });

module.exports = mongoose.model('Course', CourseSchema);
