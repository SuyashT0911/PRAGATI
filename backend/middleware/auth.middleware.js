/**
 * PRAGATI — Auth Middleware
 */
'use strict';
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ success: false, error: 'Invalid or expired token' });
        req.user = decoded;
        next();
    });
}

function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    next();
}

// Optional auth — sets req.user if token present, but doesn't block
function optionalAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (!err) req.user = decoded;
            next();
        });
    } else {
        next();
    }
}

module.exports = { authenticateToken, requireAdmin, optionalAuth };
