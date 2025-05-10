const express = require('express');
const {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  deleteConversation,handleChat,
  getHome} = require('../controllers/chatController.js');

const chat = express.Router();

// All routes here are protected by the auth middleware in server/index.js

// Conversation routes
chat.get('/conversations', getConversations);
chat.post('/conversations', createConversation);
chat.delete('/conversations/:conversationId', deleteConversation);

// Message routes
chat.get('/conversations/:conversationId/messages', getMessages);
chat.post('/conversations/:conversationId/messages', sendMessage);
chat.post('/chat/:handle', handleChat);
chat.get('/',getHome);

module.exports = chat;