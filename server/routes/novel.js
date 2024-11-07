const express = require('express');
const Novel = require('../model/Novel');
const router = express.Router();

// Create a new novel
router.post('/', async (req, res) => {
  try {
    const novel = new Novel(req.body);
    await novel.save();
    res.status(201).json(novel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all novels
router.get('/', async (req, res) => {
  try {
    const novels = await Novel.find().populate('chapters').populate('category').populate('user_favorites');
    res.status(200).json(novels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a novel by ID
router.get('/:id', async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id).populate('chapters').populate('category').populate('createdBy').populate('user_favorites');
    if (!novel) return res.status(404).json({ message: 'Novel not found' });
    res.json(novel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a novel by ID
router.put('/:id', async (req, res) => {
  try {
    const novel = await Novel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(novel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a novel by ID
router.delete('/:id', async (req, res) => {
  try {
    await Novel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Novel deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
