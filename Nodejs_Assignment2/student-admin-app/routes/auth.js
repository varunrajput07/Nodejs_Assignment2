const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/register', async(req, res) => {
    const { username, password } = req.body;
    try {
        let user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'Admin registered' });
    } catch (err) {
        res.status(400).json({ error: 'User already exists' });
    }
});

router.post('/login', async(req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, 'secretkey', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: 'Error logging in' });
    }
});

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token.split(' ')[1], 'secretkey');
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ message: 'Token is not valid' });
    }
};

module.exports = router;
module.exports.authMiddleware = authMiddleware;