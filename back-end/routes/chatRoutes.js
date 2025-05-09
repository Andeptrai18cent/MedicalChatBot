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
router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.delete('/conversations/:conversationId', deleteConversation);

// Message routes
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/conversations/:conversationId/messages', sendMessage);
router.post('/chat/:handle', handleChat);
router.get('/',getHome);

module.exports = chat;