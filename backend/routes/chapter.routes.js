/**
 * PRAGATI — Chapter Routes
 */
'use strict';
const router = require('express').Router();
const ctrl = require('../controllers/chapter.controller');
const { authenticateToken, optionalAuth, requireAdmin } = require('../middleware/auth.middleware');

// Public / student
router.get('/:id', optionalAuth, ctrl.getChapter);

// Authenticated
router.post('/:id/quiz', authenticateToken, ctrl.submitQuiz);

// Admin
router.post('/', authenticateToken, requireAdmin, ctrl.create);

module.exports = router;
