const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-chatbot', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/chats', require('./routes/chats'));
app.use('/api/messages', require('./routes/messages'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});