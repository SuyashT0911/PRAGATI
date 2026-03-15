/**
 * PRAGATI — Enrollment Controller
 */
'use strict';
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const Progress = require('../models/Progress');
const Certificate = require('../models/Certificate');

// POST /api/v1/enroll/:courseId
exports.enroll = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).json({ success: false, error: 'Course not found' });

        // Check if already enrolled
        const exists = await Enrollment.findOne({ user: req.user.id, course: course._id });
        if (exists) {
            return res.json({ success: true, message: 'Already enrolled', enrollment: exists });
        }

        const enrollment = await Enrollment.create({
            user: req.user.id,
            course: course._id,
        });

        // Increment course enroll count
        await Course.findByIdAndUpdate(course._id, { $inc: { enrollCount: 1 } });

        // Create progress entries for all chapters (first unlocked)
        const chapters = await Chapter.find({ course: course._id, isPublished: true }).sort({ order: 1 });
        for (const ch of chapters) {
            await Progress.create({
                user: req.user.id,
                chapter: ch._id,
                course: course._id,
            });
        }

        res.status(201).json({ success: true, enrollment });
    } catch (err) {
        console.error('Enroll error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// GET /api/v1/my/courses — My enrolled courses with progress
exports.myCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ user: req.user.id })
            .populate('course')
            .sort({ enrolledAt: -1 });

        res.json({ success: true, enrollments });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// GET /api/v1/my/certificates
exports.myCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({ user: req.user.id }).sort({ issuedAt: -1 });
        res.json({ success: true, certificates });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// POST /api/v1/my/certificate/:courseId — Generate certificate
exports.generateCertificate = async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({
            user: req.user.id,
            course: req.params.courseId,
            isCompleted: true,
        }).populate('course');

        if (!enrollment) {
            return res.status(400).json({ success: false, error: 'Course not completed yet' });
        }

        // Check if already issued
        const existing = await Certificate.findOne({ user: req.user.id, course: req.params.courseId });
        if (existing) {
            return res.json({ success: true, certificate: existing });
        }

        const User = require('../models/User');
        const user = await User.findById(req.user.id);

        // Generate unique certificate ID
        const count = await Certificate.countDocuments();
        const certId = `PRAG-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

        const certificate = await Certificate.create({
            user: req.user.id,
            course: req.params.courseId,
            enrollment: enrollment._id,
            certificateId: certId,
            userName: user.fullName,
            courseName: enrollment.course.title,
        });

        res.status(201).json({ success: true, certificate });
    } catch (err) {
        console.error('Certificate error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
