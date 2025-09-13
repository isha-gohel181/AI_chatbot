const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Message = require('../models/Message');
const Chat = require('../models/Chat');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get messages for a chat
router.get('/:chatId', async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).sort({
      timestamp: 1,
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message and get AI response
router.post('/', async (req, res) => {
  try {
    // --- FIX: Added userId back to the destructuring ---
    const { chatId, content, userId } = req.body;

    if (!chatId || !content || !userId) {
      return res.status(400).json({ error: 'chatId, content, and userId are required' });
    }

    // Save user message
    const userMessage = new Message({ chatId, content, role: 'user' });
    await userMessage.save();

    // --- FIX: Reverted to the original, faster model ---
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Get AI response for the chat content
    const chatResult = await model.generateContent(content);
    const aiResponse = chatResult?.response?.text?.();

    if (!aiResponse) {
      console.error('⚠️ AI response is empty or undefined');
      return res.status(500).json({ error: 'AI did not return a valid response' });
    }

    // Save AI message
    const assistantMessage = new Message({ chatId, content: aiResponse, role: 'assistant' });
    await assistantMessage.save();

    // Initialize updatedChat to null
    let updatedChat = null;
    const chat = await Chat.findById(chatId);

    // Check if it's the first message of a new chat to generate a title
    if (chat && chat.title === 'New Chat') {
      const titlePrompt = `Generate a very short, concise title (4 words maximum) for a conversation that starts with: "${content}". Do not include quotes in the title.`;
      
      const titleResult = await model.generateContent(titlePrompt);
      let newTitle = titleResult?.response?.text?.().trim().replace(/"/g, '') || content.substring(0, 30);
      
      // Fallback in case the generated title is empty
      if (!newTitle) {
        newTitle = content.substring(0, 30) + "...";
      }

      updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { title: newTitle, updatedAt: new Date() },
        { new: true } // This option returns the updated document
      );
    } else {
      // If not a new chat, just update the timestamp
      await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });
    }

    res.json({ userMessage, assistantMessage, updatedChat });

  } catch (err) {
    console.error('❌ Internal Server Error in messages route:', err);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

module.exports = router;