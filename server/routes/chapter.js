const express = require('express');
const Chapter = require('../model/Chapter');
const router = express.Router();

// Create a new chapter
router.post('/', async (req, res) => {
  try {
    const chapter = new Chapter(req.body);
    await chapter.save();
    res.status(201).json(chapter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all chapters
router.get('/', async (req, res) => {
  try {
    const chapters = await Chapter.find().populate('novel');
    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a chapter by ID
router.get('/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate('novel');
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a chapter by ID
router.put('/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(chapter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a chapter by ID
router.delete('/:id', async (req, res) => {
  try {
    await Chapter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Chapter deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
