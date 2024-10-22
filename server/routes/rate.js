const express = require('express');
const Rate = require('../model/Rate');
const router = express.Router();

// Create a new rate
router.post('/', async (req, res) => {
  try {
    const rate = new Rate(req.body);
    await rate.save();
    res.status(201).json(rate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all rates
router.get('/', async (req, res) => {
  try {
    const rates = await Rate.find().populate('novels');
    res.status(200).json(rates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a rate by ID
router.get('/:id', async (req, res) => {
  try {
    const rate = await Rate.findById(req.params.id).populate('novels');
    if (!rate) return res.status(404).json({ message: 'Rate not found' });
    res.json(rate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a rate by ID
router.put('/:id', async (req, res) => {
  try {
    const rate = await Rate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(rate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a rate by ID
router.delete('/:id', async (req, res) => {
  try {
    await Rate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rate deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
