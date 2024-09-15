const express = require('express');
const Student = require('../models/Student');
const { authMiddleware } = require('./auth');
const router = express.Router();

router.post('/', authMiddleware, async(req, res) => {
    const { name, age, class: studentClass } = req.body;
    try {
        const newStudent = new Student({ name, age, class: studentClass });
        await newStudent.save();
        res.json(newStudent);
    } catch (err) {
        res.status(400).json({ error: 'Error creating student' });
    }
});

router.get('/', authMiddleware, async(req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(400).json({ error: 'Error fetching students' });
    }
});

router.put('/:id', authMiddleware, async(req, res) => {
    const { id } = req.params;
    const { name, age, class: studentClass } = req.body;
    try {
        const student = await Student.findByIdAndUpdate(id, { name, age, class: studentClass }, { new: true });
        res.json(student);
    } catch (err) {
        res.status(400).json({ error: 'Error updating student' });
    }
});

router.delete('/:id', authMiddleware, async(req, res) => {
    const { id } = req.params;
    try {
        await Student.findByIdAndDelete(id);
        res.json({ message: 'Student deleted' });
    } catch (err) {
        res.status(400).json({ error: 'Error deleting student' });
    }
});

module.exports = router;