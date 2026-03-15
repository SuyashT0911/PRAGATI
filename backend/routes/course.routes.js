/**
 * PRAGATI — Course Routes
 */
'use strict';
const router = require('express').Router();
const ctrl = require('../controllers/course.controller');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth.middleware');

// Public
router.get('/', ctrl.list);
router.get('/filters', ctrl.getFilters);
router.get('/:slug', optionalAuth, ctrl.getBySlug);

// Admin
router.post('/', authenticateToken, requireAdmin, ctrl.create);
router.put('/:id', authenticateToken, requireAdmin, ctrl.update);
router.delete('/:id', authenticateToken, requireAdmin, ctrl.remove);

module.exports = router;
