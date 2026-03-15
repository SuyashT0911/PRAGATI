/**
 * PRAGATI — Auth Routes
 */
'use strict';
const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', authenticateToken, ctrl.me);
router.put('/profile', authenticateToken, ctrl.updateProfile);

module.exports = router;
