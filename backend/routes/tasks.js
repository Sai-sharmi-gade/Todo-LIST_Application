const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Add a new task
router.post('/', async (req, res) => {
  const newTask = new Task({
    name: req.body.name,
    completed: req.body.completed || false,
    date: req.body.date,    // Save date
    time: req.body.time     // Save time
  });
  try {
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Toggle task completion
router.put('/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json('Task deleted');
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
