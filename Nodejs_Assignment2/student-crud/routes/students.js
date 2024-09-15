const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.get('/', async(req, res) => {
    const students = await Student.find();
    res.render('students/list', { students });
});

router.get('/new', (req, res) => {
    res.render('students/create');
});

router.post('/', async(req, res) => {
    const { name, age, grade } = req.body;
    const student = new Student({ name, age, grade });
    await student.save();
    res.redirect('/students');
});

router.get('/:id/edit', async(req, res) => {
    const student = await Student.findById(req.params.id);
    res.render('students/edit', { student });
});

router.post('/:id', async(req, res) => {
    const { name, age, grade } = req.body;
    await Student.findByIdAndUpdate(req.params.id, { name, age, grade });
    res.redirect('/students');
});

router.post('/:id/delete', async(req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.redirect('/students');
});

module.exports = router;