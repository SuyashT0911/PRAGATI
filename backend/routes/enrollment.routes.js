/**
 * PRAGATI — Enrollment Routes
 */
'use strict';
const router = require('express').Router();
const ctrl = require('../controllers/enrollment.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.post('/enroll/:courseId', authenticateToken, ctrl.enroll);
router.get('/my/courses', authenticateToken, ctrl.myCourses);
router.get('/my/certificates', authenticateToken, ctrl.myCertificates);
router.post('/my/certificate/:courseId', authenticateToken, ctrl.generateCertificate);

module.exports = router;
