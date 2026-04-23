require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Quiz = require('./models/Quiz');
const Score = require('./models/Score');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

console.log('Attempting to connect to MongoDB with URI:', MONGODB_URI.replace(/:([^@]+)@/, ':***@')); // Hide password in logs

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Please check your MongoDB connection string in .env file');
    process.exit(1);
  });

// Handle connection errors after initial connection
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

// API Routes

// GET /quizzes - Fetch all quizzes
app.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// POST /quizzes - Add a new quiz
app.post('/quizzes', async (req, res) => {
  try {
    const {
      asker,
      askerName,
      targetName,
      targetPlayer,
      question,
      options,
      correct,
      time
    } = req.body;

    // Validation
    if (!asker || !askerName || !targetName || !targetPlayer || !question || !options || correct === undefined || !time) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (options.length < 2 || options.length > 4) {
      return res.status(400).json({ error: 'Quiz must have between 2 and 4 options' });
    }

    if (correct < 0 || correct >= options.length) {
      return res.status(400).json({ error: 'Correct answer index must be within options bounds' });
    }

    const newQuiz = new Quiz({
      asker,
      askerName,
      targetName,
      targetPlayer,
      question,
      options,
      correct,
      time,
      answered: false,
      answeredCorrect: false,
      chosen: null
    });

    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// PUT /quizzes/:id - Update a quiz
app.put('/quizzes/:id', async (req, res) => {
  try {
    const {
      asker,
      askerName,
      targetName,
      targetPlayer,
      question,
      options,
      correct,
      time
    } = req.body;

    // Validation
    if (!asker || !askerName || !targetName || !targetPlayer || !question || !options || correct === undefined || !time) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (options.length < 2 || options.length > 4) {
      return res.status(400).json({ error: 'Quiz must have between 2 and 4 options' });
    }

    if (correct < 0 || correct >= options.length) {
      return res.status(400).json({ error: 'Correct answer index must be within options bounds' });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      {
        asker,
        askerName,
        targetName,
        targetPlayer,
        question,
        options,
        correct,
        time
      },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json(updatedQuiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ error: 'Failed to update quiz' });
  }
});

// PATCH /quizzes/:id - Update quiz answer
app.patch('/quizzes/:id', async (req, res) => {
  try {
    const { chosen } = req.body;
    
    if (chosen === undefined) {
      return res.status(400).json({ error: 'Chosen answer index is required' });
    }

    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    if (quiz.answered) {
      return res.status(400).json({ error: 'Quiz has already been answered' });
    }

    if (chosen < 0 || chosen >= quiz.options.length) {
      return res.status(400).json({ error: 'Invalid answer choice' });
    }

    // Update quiz with answer
    quiz.answered = true;
    quiz.chosen = chosen;
    quiz.answeredCorrect = chosen === quiz.correct;

    const updatedQuiz = await quiz.save();
    res.json(updatedQuiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ error: 'Failed to update quiz' });
  }
});

// DELETE /quizzes/:id - Delete a quiz (optional utility)
app.delete('/quizzes/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

// ===== SCORE API ENDPOINTS =====

// GET /scores - Fetch all player scores
app.get('/scores', async (req, res) => {
  try {
    const scores = await Score.find().sort({ playerNumber: 1 });
    res.json(scores);
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

// POST /scores - Initialize or update player scores
app.post('/scores', async (req, res) => {
  try {
    const { playerNumber, playerName, correctAnswers, wrongAnswers } = req.body;

    // Validation
    if (!playerNumber || !playerName) {
      return res.status(400).json({ error: 'Player number and name are required' });
    }

    if (playerNumber < 1 || playerNumber > 2) {
      return res.status(400).json({ error: 'Player number must be 1 or 2' });
    }

    // Use findOneAndUpdate with upsert to create or update
    const score = await Score.findOneAndUpdate(
      { playerNumber },
      {
        playerName,
        correctAnswers: correctAnswers || 0,
        wrongAnswers: wrongAnswers || 0
      },
      { upsert: true, new: true }
    );

    res.json(score);
  } catch (error) {
    console.error('Error updating score:', error);
    res.status(500).json({ error: 'Failed to update score' });
  }
});

// PATCH /scores/:playerNumber - Update a specific player's score
app.patch('/scores/:playerNumber', async (req, res) => {
  try {
    const { correctAnswers, wrongAnswers } = req.body;
    const playerNumber = parseInt(req.params.playerNumber);

    if (playerNumber < 1 || playerNumber > 2) {
      return res.status(400).json({ error: 'Player number must be 1 or 2' });
    }

    const score = await Score.findOneAndUpdate(
      { playerNumber },
      { correctAnswers, wrongAnswers },
      { new: true }
    );

    if (!score) {
      return res.status(404).json({ error: 'Score not found for this player' });
    }

    res.json(score);
  } catch (error) {
    console.error('Error updating score:', error);
    res.status(500).json({ error: 'Failed to update score' });
  }
});

// Serve the main HTML file for all other routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'hiwaar.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Love Quiz server running on http://localhost:${PORT}`);
  console.log(`📱 Frontend available at http://localhost:${PORT}`);
  console.log(`🔗 API endpoints:`);
  console.log(`   GET  /quizzes - Fetch all quizzes`);
  console.log(`   POST /quizzes - Create new quiz`);
  console.log(`   PATCH /quizzes/:id - Update quiz answer`);
  console.log(`   DELETE /quizzes/:id - Delete quiz`);
});

module.exports = app;
