const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  playerNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 2
  },
  playerName: {
    type: String,
    required: true,
    trim: true
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  wrongAnswers: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure only one score record per player
scoreSchema.index({ playerNumber: 1 }, { unique: true });

module.exports = mongoose.model('Score', scoreSchema);
