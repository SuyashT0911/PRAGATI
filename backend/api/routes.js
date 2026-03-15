/**
 * PRAGATI — API Routes
 * ─────────────────────
 * All backend REST API endpoints are defined here.
 *
 * Base URL: /api/v1
 *
 * Auth Routes:
 *   POST /api/v1/auth/register    → Create new user
 *   POST /api/v1/auth/login       → Login, returns JWT
 *   POST /api/v1/auth/logout      → Invalidate session
 *   GET  /api/v1/auth/me          → Get current user (JWT required)
 *
 * Path Routes:
 *   GET  /api/v1/paths            → List all paths (public)
 *   GET  /api/v1/paths/:level     → Paths by education level
 *   GET  /api/v1/paths/:id        → Single path details
 *
 * User Dashboard Routes (JWT required):
 *   GET  /api/v1/user/profile     → User profile
 *   PUT  /api/v1/user/profile     → Update profile
 *   GET  /api/v1/user/progress    → Enrolled courses + progress
 *   POST /api/v1/user/enroll/:id  → Enroll in a course
 *
 * Admin Routes (admin JWT required):
 *   GET  /api/v1/admin/users      → All users
 *   GET  /api/v1/admin/stats      → Platform statistics
 *   POST /api/v1/admin/paths      → Add new path
 *   PUT  /api/v1/admin/paths/:id  → Edit path
 *   DEL  /api/v1/admin/paths/:id  → Delete path
 */

'use strict';

// const express = require('express');
// const router  = express.Router();
// const { authenticateToken } = require('../auth/auth');

// ── Auth ────────────────────────────────────────────────────────
// router.post('/auth/register', async (req, res) => { ... });
// router.post('/auth/login',    async (req, res) => { ... });
// router.get('/auth/me',        authenticateToken, (req, res) => { ... });

// ── Paths ────────────────────────────────────────────────────────
// router.get('/paths',          async (req, res) => { ... });
// router.get('/paths/:level',   async (req, res) => { ... });

// module.exports = router;
