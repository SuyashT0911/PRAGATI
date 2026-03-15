/**
 * PRAGATI — Admin Routes
 */
'use strict';
const router = require('express').Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware');
const admin = require('../controllers/admin.controller');

// All admin routes require auth + admin role
router.use(authenticateToken, requireAdmin);

// Dashboard
router.get('/stats', admin.getStats);
router.get('/activity', admin.getRecentActivity);

// Users
router.get('/users', admin.getUsers);
router.get('/users/:id', admin.getUserById);
router.post('/users', admin.createUser);
router.put('/users/:id', admin.updateUser);
router.delete('/users/:id', admin.deleteUser);

// Courses
router.get('/courses', admin.getAdminCourses);
router.post('/courses', admin.createCourse);
router.patch('/courses/:id/publish', admin.toggleCoursePublish);
router.delete('/courses/:id', admin.deleteCourse);

module.exports = router;
