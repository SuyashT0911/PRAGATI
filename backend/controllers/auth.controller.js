/**
 * PRAGATI — Auth Controller
 */
'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Activity = require('../models/Activity');

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, eduLevel } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, error: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({ firstName, lastName, email, passwordHash, eduLevel });

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.fullName },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Log registration activity
        Activity.create({ type: 'registration', message: `${user.fullName} registered as a new student`, userId: user._id }).catch(() => {});

        res.status(201).json({
            success: true,
            token,
            user: { id: user._id, name: user.fullName, email: user.email, role: user.role },
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.fullName },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Log login activity
        Activity.create({ type: 'login', message: `${user.fullName} logged in`, userId: user._id }).catch(() => {});

        res.json({
            success: true,
            token,
            user: { id: user._id, name: user.fullName, email: user.email, role: user.role },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-passwordHash');
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, eduLevel, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (eduLevel) user.eduLevel = eduLevel;

        // Password change
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ success: false, error: 'Current password required to set new password' });
            }
            const valid = await bcrypt.compare(currentPassword, user.passwordHash);
            if (!valid) {
                return res.status(400).json({ success: false, error: 'Current password is incorrect' });
            }
            const salt = await bcrypt.genSalt(12);
            user.passwordHash = await bcrypt.hash(newPassword, salt);
        }

        await user.save();

        // Log profile update activity
        Activity.create({ type: 'profile_update', message: `${user.fullName} updated their profile`, userId: user._id }).catch(() => {});

        res.json({
            success: true,
            user: { id: user._id, name: user.fullName, email: user.email, role: user.role },
            message: 'Profile updated successfully',
        });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
