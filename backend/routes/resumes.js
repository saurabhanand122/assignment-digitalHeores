const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');

// GET all resumes
router.get('/', async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving resumes: ' + err.message });
  }
});

// GET single resume by ID
router.get('/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(resume);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.status(500).json({ error: 'Server error retrieving resume: ' + err.message });
  }
});

// POST create new resume
router.post('/', async (req, res) => {
  try {
    const newResume = new Resume(req.body);
    const savedResume = await newResume.save();
    res.status(201).json(savedResume);
  } catch (err) {
    res.status(400).json({ error: 'Error creating resume: ' + err.message });
  }
});

// PUT update resume
router.put('/:id', async (req, res) => {
  try {
    const updatedResume = await Resume.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedResume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(updatedResume);
  } catch (err) {
    res.status(400).json({ error: 'Error updating resume: ' + err.message });
  }
});

// DELETE resume
router.delete('/:id', async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json({ message: 'Resume deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error deleting resume: ' + err.message });
  }
});

module.exports = router;
