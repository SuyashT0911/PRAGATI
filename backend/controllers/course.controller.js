/**
 * PRAGATI — Course Controller
 */
'use strict';
const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const Enrollment = require('../models/Enrollment');

// GET /api/v1/courses — List all courses with filters
exports.list = async (req, res) => {
    try {
        const { stream, degree, university, category, difficulty, search, featured, page = 1, limit = 20 } = req.query;
        const filter = { isPublished: true };

        if (stream) filter.stream = stream;
        if (degree) filter.degree = degree;
        if (university) filter.university = university;
        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;
        if (featured === 'true') filter.isFeatured = true;
        if (search) {
            filter.$text = { $search: search };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Course.countDocuments(filter);
        const courses = await Course.find(filter)
            .sort({ isFeatured: -1, enrollCount: -1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            success: true,
            courses,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (err) {
        console.error('Course list error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// GET /api/v1/courses/:slug — Single course with chapter list
exports.getBySlug = async (req, res) => {
    try {
        const course = await Course.findOne({ slug: req.params.slug, isPublished: true });
        if (!course) return res.status(404).json({ success: false, error: 'Course not found' });

        const chapters = await Chapter.find({ course: course._id, isPublished: true })
            .select('title slug order summary readTimeMinutes isLocked quiz')
            .sort({ order: 1 });

        // Check if user is enrolled (if authenticated)
        let enrollment = null;
        if (req.user) {
            enrollment = await Enrollment.findOne({ user: req.user.id, course: course._id });
        }

        // Add hasQuiz flag to chapters
        const chaptersData = chapters.map(ch => ({
            ...ch.toObject(),
            hasQuiz: ch.quiz && ch.quiz.questions && ch.quiz.questions.length > 0,
            quiz: undefined, // Don't send quiz data in listing
        }));

        res.json({
            success: true,
            course,
            chapters: chaptersData,
            isEnrolled: !!enrollment,
            enrollment,
        });
    } catch (err) {
        console.error('Course detail error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// GET /api/v1/courses/streams/list — Get all unique streams & degrees
exports.getFilters = async (req, res) => {
    try {
        const streams = await Course.distinct('stream', { isPublished: true });
        const degrees = await Course.distinct('degree', { isPublished: true });
        const categories = await Course.distinct('category', { isPublished: true });
        res.json({ success: true, streams, degrees, categories });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// POST /api/v1/admin/courses — Create a course (admin)
exports.create = async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json({ success: true, course });
    } catch (err) {
        console.error('Course create error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// PUT /api/v1/admin/courses/:id — Update course (admin)
exports.update = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
        res.json({ success: true, course });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// DELETE /api/v1/admin/courses/:id — Delete course (admin)
exports.remove = async (req, res) => {
    try {
        await Chapter.deleteMany({ course: req.params.id });
        await Course.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Course and its chapters deleted' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
