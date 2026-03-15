/**
 * PRAGATI — Server-side Authentication
 * ─────────────────────────────────────
 * This file handles SERVER-SIDE auth logic:
 *   - Password hashing with bcrypt
 *   - JWT token generation + validation
 *   - Session management
 *   - Google OAuth strategy
 *
 * NOTE: This is NOT the same as frontend/scripts/auth.js
 *       which handles browser-side form validation.
 *
 * Dependencies (to install when backend is set up):
 *   npm install bcryptjs jsonwebtoken passport passport-google-oauth20
 */

'use strict';

// const bcrypt  = require('bcryptjs');
// const jwt     = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET;

// ── Hash a password ─────────────────────────────────────────────
// async function hashPassword(plain) {
//     const salt = await bcrypt.genSalt(12);
//     return bcrypt.hash(plain, salt);
// }

// ── Verify a password ──────────────────────────────────────────
// async function verifyPassword(plain, hash) {
//     return bcrypt.compare(plain, hash);
// }

// ── Generate JWT ────────────────────────────────────────────────
// function generateToken(userId, role) {
//     return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });
// }

// ── Verify JWT middleware ───────────────────────────────────────
// function authenticateToken(req, res, next) {
//     const token = req.headers['authorization']?.split(' ')[1];
//     if (!token) return res.status(401).json({ error: 'No token provided' });
//     jwt.verify(token, JWT_SECRET, (err, user) => {
//         if (err) return res.status(403).json({ error: 'Invalid token' });
//         req.user = user;
//         next();
//     });
// }

// module.exports = { hashPassword, verifyPassword, generateToken, authenticateToken };
