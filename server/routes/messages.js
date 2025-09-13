  const express = require('express');
  const router = express.Router();
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const Message = require('../models/Message');
  const Chat = require('../models/Chat');

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // Get messages for a chat
  router.get('/:chatId', async (req, res) => {
    try {
      const messages = await Message.find({ chatId: req.params.chatId })
        .sort({ timestamp: 1 });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Send message and get AI response
router.post('/', async (req, res) => {
  try {
    const { chatId, content, userId } = req.body;

    if (!chatId || !content || !userId) {
      return res.status(400).json({ error: 'chatId, content, and userId are required' });
    }

    console.log('💬 Incoming message:', content);

    const userMessage = new Message({
      chatId,
      content,
      role: 'user'
    });
    await userMessage.save();

    const chatHistory = await Message.find({ chatId }).sort({ timestamp: 1 });
    const context = chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n');

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let aiResponse = '';

    try {
      const result = await model.generateContent(content);
      aiResponse = result?.response?.text?.();

      if (!aiResponse) {
        console.error('⚠️ AI response is empty or undefined');
        return res.status(500).json({ error: 'AI did not return a valid response' });
      }

    } catch (aiErr) {
      console.error('❌ Gemini API error:', aiErr);
      return res.status(500).json({ error: 'Failed to get response from Gemini' });
    }

    const assistantMessage = new Message({
      chatId,
      content: aiResponse,
      role: 'assistant'
    });
    await assistantMessage.save();

    await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });

    res.json({ userMessage, assistantMessage });

  } catch (err) {
    console.error('❌ Internal Server Error:', err);
    res.status(500).json({ error: err.message });
  }
});

  module.exports = router;