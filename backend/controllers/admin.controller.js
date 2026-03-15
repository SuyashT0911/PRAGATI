/**
 * PRAGATI — Admin Controller
 * ──────────────────────────
 * Admin-only endpoints for platform management
 */
'use strict';
const User = require('../models/User');
const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const Certificate = require('../models/Certificate');
const Activity = require('../models/Activity');
const bcrypt = require('bcryptjs');

/* ═══════════════ DASHBOARD STATS ═══════════════ */
exports.getStats = async (req, res) => {
    try {
        const [totalUsers, totalCourses, totalEnrollments, totalCertificates] = await Promise.all([
            User.countDocuments(),
            Course.countDocuments(),
            Enrollment.countDocuments(),
            Certificate.countDocuments(),
        ]);

        const activeStudents = await Enrollment.distinct('user').then(ids => ids.length);
        const publishedCourses = await Course.countDocuments({ published: true });

        // Recent registrations (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

        // Monthly user growth (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthlyGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]);

        // Top courses by enrollment
        const topCourses = await Enrollment.aggregate([
            { $group: { _id: '$course', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
            { $unwind: '$course' },
            { $project: { name: '$course.title', count: 1 } },
        ]);

        // Completion stats
        const completedEnrollments = await Enrollment.countDocuments({ completed: true });
        const completionRate = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;

        // Role counts
        const adminCount = await User.countDocuments({ role: 'admin' });
        const studentCount = totalUsers - adminCount;

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalCourses,
                publishedCourses,
                totalEnrollments,
                totalCertificates,
                activeStudents,
                recentUsers,
                completionRate,
                monthlyGrowth,
                topCourses,
                adminCount,
                studentCount,
            },
        });
    } catch (err) {
        console.error('Admin stats error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

/* ═══════════════ USER MANAGEMENT ═══════════════ */
exports.getUsers = async (req, res) => {
    try {
        const { search, role, page = 1, limit = 50 } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        if (role) query.role = role;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [users, total] = await Promise.all([
            User.find(query).select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
            User.countDocuments(query),
        ]);

        // Get enrollment counts for each user
        const userIds = users.map(u => u._id);
        const enrollmentCounts = await Enrollment.aggregate([
            { $match: { user: { $in: userIds } } },
            { $group: { _id: '$user', count: { $sum: 1 } } },
        ]);
        const enrollMap = {};
        enrollmentCounts.forEach(e => { enrollMap[e._id.toString()] = e.count; });

        // Check last activity (login) for online status
        const recentLogins = await Activity.aggregate([
            { $match: { userId: { $in: userIds }, type: 'login' } },
            { $sort: { createdAt: -1 } },
            { $group: { _id: '$userId', lastLogin: { $first: '$createdAt' } } },
        ]);
        const loginMap = {};
        recentLogins.forEach(l => { loginMap[l._id.toString()] = l.lastLogin; });

        const enrichedUsers = users.map(u => ({
            ...u.toObject(),
            enrolledCourses: enrollMap[u._id.toString()] || 0,
            lastLogin: loginMap[u._id.toString()] || null,
            isOnline: loginMap[u._id.toString()] ? (Date.now() - new Date(loginMap[u._id.toString()]).getTime() < 15 * 60 * 1000) : false,
        }));

        res.json({
            success: true,
            users: enrichedUsers,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
        });
    } catch (err) {
        console.error('Get users error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        const [enrollments, certificates] = await Promise.all([
            Enrollment.find({ user: user._id }).populate('course', 'title slug'),
            Certificate.find({ user: user._id }).populate('course', 'title'),
        ]);

        res.json({ success: true, user, enrollments, certificates });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role = 'student' } = req.body;
        if (!firstName || !email || !password) {
            return res.status(400).json({ success: false, error: 'Name, email and password are required' });
        }

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ success: false, error: 'Email already exists' });

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            firstName,
            lastName: lastName || '',
            email,
            passwordHash,
            role,
        });

        // Log activity
        Activity.create({ type: 'user_created', message: `Admin created new ${role}: ${user.fullName}`, userId: user._id }).catch(() => {});

        res.status(201).json({
            success: true,
            user: { id: user._id, name: user.fullName, email: user.email, role: user.role },
        });
    } catch (err) {
        console.error('Create user error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, role } = req.body;
        const updates = {};
        if (firstName !== undefined) updates.firstName = firstName;
        if (lastName !== undefined) updates.lastName = lastName;
        if (email !== undefined) updates.email = email;
        if (role !== undefined) updates.role = role;

        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-passwordHash');
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        // Log activity
        Activity.create({ type: 'profile_update', message: `Admin updated profile of ${user.fullName}`, userId: user._id }).catch(() => {});

        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        if (user._id.toString() === req.user.id) {
            return res.status(400).json({ success: false, error: 'Cannot delete your own account' });
        }

        const userName = user.fullName;

        await Promise.all([
            Enrollment.deleteMany({ user: user._id }),
            Progress.deleteMany({ user: user._id }),
            Certificate.deleteMany({ user: user._id }),
            User.findByIdAndDelete(user._id),
        ]);

        // Log activity
        Activity.create({ type: 'user_deleted', message: `Admin deleted user: ${userName}` }).catch(() => {});

        res.json({ success: true, message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

/* ═══════════════ COURSE MANAGEMENT ═══════════════ */
exports.getAdminCourses = async (req, res) => {
    try {
        const { search, page = 1, limit = 20 } = req.query;
        const query = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { stream: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [courses, total] = await Promise.all([
            Course.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
            Course.countDocuments(query),
        ]);

        const courseIds = courses.map(c => c._id);
        const [chapterCounts, enrollCounts] = await Promise.all([
            Chapter.aggregate([
                { $match: { course: { $in: courseIds } } },
                { $group: { _id: '$course', count: { $sum: 1 } } },
            ]),
            Enrollment.aggregate([
                { $match: { course: { $in: courseIds } } },
                { $group: { _id: '$course', count: { $sum: 1 } } },
            ]),
        ]);

        const chapterMap = {};
        chapterCounts.forEach(c => { chapterMap[c._id.toString()] = c.count; });
        const enrollMap = {};
        enrollCounts.forEach(e => { enrollMap[e._id.toString()] = e.count; });

        const enriched = courses.map(c => ({
            ...c.toObject(),
            chapterCount: chapterMap[c._id.toString()] || 0,
            enrollmentCount: enrollMap[c._id.toString()] || 0,
        }));

        res.json({ success: true, courses: enriched, total, totalPages: Math.ceil(total / parseInt(limit)) });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.createCourse = async (req, res) => {
    try {
        const { title, description, stream, level, duration, published } = req.body;
        if (!title || !stream) {
            return res.status(400).json({ success: false, error: 'Title and stream are required' });
        }

        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const existing = await Course.findOne({ slug });
        if (existing) return res.status(400).json({ success: false, error: 'A course with this title already exists' });

        const course = await Course.create({
            title,
            slug,
            description: description || '',
            stream: stream || 'General',
            level: level || 'beginner',
            duration: duration || '0h',
            published: published || false,
        });

        // Log activity
        Activity.create({ type: 'course_created', message: `Admin created course: ${course.title}` }).catch(() => {});

        res.status(201).json({ success: true, course });
    } catch (err) {
        console.error('Create course error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.toggleCoursePublish = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ success: false, error: 'Course not found' });

        course.published = !course.published;
        await course.save();

        res.json({ success: true, published: course.published });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ success: false, error: 'Course not found' });

        const title = course.title;

        await Promise.all([
            Chapter.deleteMany({ course: course._id }),
            Enrollment.deleteMany({ course: course._id }),
            Progress.deleteMany({ course: course._id }),
            Certificate.deleteMany({ course: course._id }),
            Course.findByIdAndDelete(course._id),
        ]);

        Activity.create({ type: 'course_deleted', message: `Admin deleted course: ${title}` }).catch(() => {});

        res.json({ success: true, message: 'Course and related data deleted' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

/* ═══════════════ REAL-TIME ACTIVITY FEED ═══════════════ */
exports.getRecentActivity = async (req, res) => {
    try {
        const activities = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        const iconMap = {
            registration: 'fa-user-plus',
            login: 'fa-sign-in-alt',
            enrollment: 'fa-book-reader',
            certificate: 'fa-certificate',
            profile_update: 'fa-user-edit',
            course_created: 'fa-plus-circle',
            course_deleted: 'fa-trash',
            user_created: 'fa-user-plus',
            user_deleted: 'fa-user-minus',
        };

        const colorMap = {
            registration: '#4f46e5',
            login: '#0d9488',
            enrollment: '#7c3aed',
            certificate: '#f59e0b',
            profile_update: '#3b82f6',
            course_created: '#10b981',
            course_deleted: '#ef4444',
            user_created: '#4f46e5',
            user_deleted: '#ef4444',
        };

        const formatted = activities.map(a => ({
            type: a.type,
            icon: iconMap[a.type] || 'fa-info-circle',
            color: colorMap[a.type] || '#4f46e5',
            message: a.message,
            time: a.createdAt,
        }));

        res.json({ success: true, activities: formatted });
    } catch (err) {
        console.error('Activity error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
