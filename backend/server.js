/**
 * PRAGATI — Express Server
 * ─────────────────────────
 * Entry point for the backend API
 */
'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// ── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Serve frontend static files ─────────────────────────
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ── API Routes ──────────────────────────────────────────
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/courses', require('./routes/course.routes'));
app.use('/api/v1/chapters', require('./routes/chapter.routes'));
app.use('/api/v1', require('./routes/enrollment.routes'));
app.use('/api/v1/admin', require('./routes/admin.routes'));

// ── Health check ────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Catch-all: serve index.html for SPA-like pages ──────
app.get('*', (req, res) => {
    // If the request looks like a file, let Express handle 404
    if (path.extname(req.path)) {
        return res.status(404).send('Not found');
    }
    res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'index.html'));
});

// ── Start server ────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`\n🚀 Pragati server running on http://localhost:${PORT}`);
        console.log(`📁 Serving frontend from: ${path.join(__dirname, '..', 'frontend')}`);
        console.log(`🔗 API available at: http://localhost:${PORT}/api/v1\n`);
    });
});
