const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { protect } = require('../middleware/auth');

// ──────────────────────────────────────────
// Helper: Generate JWT
// ──────────────────────────────────────────
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// ──────────────────────────────────────────
// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
// ──────────────────────────────────────────
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // ── Input Validation ──
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }

        if (username.trim().length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // ── Check duplicates ──
        const emailExists = await User.findOne({ where: { email: email.toLowerCase() } });
        if (emailExists) return res.status(409).json({ message: 'Email is already registered' });

        const usernameExists = await User.findOne({ where: { username } });
        if (usernameExists) return res.status(409).json({ message: 'Username is already taken' });

        // ── Hash Password ──
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ── Create User ──
        const user = await User.create({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user.id)
        });

    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

// ──────────────────────────────────────────
// @route   POST /api/auth/login
// @desc    Authenticate user and return token
// @access  Public
// ──────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // ── Input Validation ──
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // ── Find User ──
        const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // ── Verify Password ──
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user.id)
        });

    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

// ──────────────────────────────────────────
// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Protected
// ──────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
    res.json(req.user);
});

module.exports = router;
