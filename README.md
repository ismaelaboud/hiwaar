# Love Quiz App 💕

A full-stack web application where users can post questions and answer them about each other. Built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

- **Two-player quiz game** - Players take turns asking and answering questions
- **Real-time scoring** - Track correct and wrong answers for each player
- **Persistent data** - All quizzes are stored in MongoDB database
- **Beautiful UI** - Modern, responsive design with animations and confetti effects
- **Cross-origin support** - CORS enabled for development

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Additional**: CORS for API access

## Prerequisites

- Node.js (version 14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm (comes with Node.js)

## Installation

### 1. Clone or Download the Project

```bash
# If you have the project files, navigate to the project directory
cd love-quiz-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up MongoDB

#### Option A: Local MongoDB Installation
```bash
# Make sure MongoDB is running on your system
# On macOS with Homebrew:
brew services start mongodb-community

# On Windows:
# Start MongoDB service from Services panel

# On Linux:
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Set environment variable:
```bash
export MONGODB_URI="your_mongodb_connection_string"
```

### 4. Start the Server

```bash
# For development (with auto-restart)
npm run dev

# Or for production
npm start
```

The server will start on `http://localhost:3000`

## Usage

1. **Open the app** - Navigate to `http://localhost:3000` in your browser
2. **Set player names** - Edit the player names in the profile cards (optional)
3. **Post questions** - Select who is asking, type a question, add 2-4 answer options, and select the correct answer
4. **Answer questions** - The other player can answer questions by clicking on answer buttons
5. **View results** - See correct/wrong answers and celebrate with confetti animations!

## API Endpoints

### GET /quizzes
Fetch all quizzes from the database

**Response:**
```json
[
  {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "asker": 1,
    "askerName": "Ismael",
    "targetName": "Ahlam",
    "targetPlayer": 2,
    "question": "What's my favorite food?",
    "options": ["Pizza", "Sushi", "Burger", "Pasta"],
    "correct": 1,
    "answered": false,
    "answeredCorrect": false,
    "chosen": null,
    "time": "7:30 PM",
    "createdAt": "2023-09-05T19:30:00.000Z",
    "updatedAt": "2023-09-05T19:30:00.000Z"
  }
]
```

### POST /quizzes
Create a new quiz

**Request Body:**
```json
{
  "asker": 1,
  "askerName": "Ismael",
  "targetName": "Ahlam",
  "targetPlayer": 2,
  "question": "What's my favorite food?",
  "options": ["Pizza", "Sushi", "Burger", "Pasta"],
  "correct": 1,
  "time": "7:30 PM"
}
```

### PATCH /quizzes/:id
Update a quiz with an answer

**Request Body:**
```json
{
  "chosen": 2
}
```

### DELETE /quizzes/:id
Delete a quiz (optional utility endpoint)

## Project Structure

```
love-quiz-app/
├── models/
│   └── Quiz.js          # Mongoose schema for quizzes
├── server.js            # Express server and API routes
├── hiwaar.html          # Frontend HTML file
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Data Model

Each quiz object contains:

- **asker** (number): Player number who asked the question (1 or 2)
- **askerName** (string): Name of the player who asked
- **targetName** (string): Name of the player who should answer
- **targetPlayer** (number): Player number who should answer (1 or 2)
- **question** (string): The quiz question
- **options** (array): Array of 2-4 answer options
- **correct** (number): Index of the correct answer in options array
- **answered** (boolean): Whether the quiz has been answered
- **answeredCorrect** (boolean): Whether the answer was correct
- **chosen** (number): Index of the chosen answer (null if unanswered)
- **time** (string): Time when the quiz was created

## Environment Variables

- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string (default: mongodb://localhost:27017/lovequiz)

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when files change.

### Adding New Features

1. **Backend changes**: Add new routes in `server.js`
2. **Database changes**: Modify the schema in `models/Quiz.js`
3. **Frontend changes**: Update JavaScript in `hiwaar.html`

## Troubleshooting

### MongoDB Connection Issues

- **Local MongoDB**: Make sure MongoDB is running
- **MongoDB Atlas**: Check your connection string and whitelist your IP
- **Connection string format**: `mongodb://localhost:27017/lovequiz`

### Port Issues

If port 3000 is busy, change the port:
```bash
PORT=4000 npm start
```

### CORS Issues

The server is configured to allow CORS for all origins. For production, you might want to restrict this to specific domains.

## License

MIT License - feel free to use this project for learning or your own applications!

## Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

Enjoy the Love Quiz app! 💕