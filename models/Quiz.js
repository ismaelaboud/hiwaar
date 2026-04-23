const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  asker: {
    type: Number,
    required: true,
    min: 1,
    max: 2
  },
  askerName: {
    type: String,
    required: true,
    trim: true
  },
  targetName: {
    type: String,
    required: true,
    trim: true
  },
  targetPlayer: {
    type: Number,
    required: true,
    min: 1,
    max: 2
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(options) {
        return options.length >= 2 && options.length <= 4;
      },
      message: 'Quiz must have between 2 and 4 options'
    }
  },
  correct: {
    type: Number,
    required: true,
    min: 0
  },
  answered: {
    type: Boolean,
    default: false
  },
  answeredCorrect: {
    type: Boolean,
    default: false
  },
  chosen: {
    type: Number,
    default: null
  },
  time: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Add validation for correct index
quizSchema.pre('save', function(next) {
  if (this.correct >= this.options.length) {
    next(new Error('Correct answer index must be within options array bounds'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Quiz', quizSchema);
