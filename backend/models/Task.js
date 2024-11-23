const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: String,
  completed: {
    type: Boolean,
    default: false
  },
  date: String,   // New field for task date
  time: String    // New field for task time
});

module.exports = mongoose.model('Task', taskSchema);
