const supabase = require('../config/supabase');
// const { generateAIResponse } = require('../services/aiService');
const axios = require('axios');

// Get all conversations for a user
const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('conversations')
      .select('id, title, created_at, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json({ conversations: data });
  } catch (error) {
    next(error);
  }
};
// Save a new conversation
const saveMessage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { conversationId, content } = req.body;

    if (!conversationId || !content) {
      return res.status(400).json({ message: 'ID cuộc hội thoại và nội dung tin nhắn là bắt buộc.' });
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([
        { conversation_id: conversationId, user_id: userId, content: content },
      ])
      .select('id, conversation_id, user_id, content, created_at');

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json({ message: 'Tin nhắn đã được lưu thành công.', message: data[0] });
  } catch (error) {
    next(error);
  }
};

// Create a new conversation
const createConversation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title = 'New Conversation' } = req.body;

    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: userId, title })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json({ conversation: data });
  } catch (error) {
    next(error);
  }
};

// Get messages for a conversation
const getMessages = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    // Verify the conversation belongs to the user
    const { data: conversationData, error: conversationError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .single();

    if (conversationError || !conversationData) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Get messages
    const { data, error } = await supabase
      .from('messages')
      .select('id, content, role, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json({ messages: data });
  } catch (error) {
    next(error);
  }
};

// Send a message and get AI response
const sendMessage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Verify the conversation belongs to the user
    const { data: conversationData, error: conversationError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .single();

    if (conversationError || !conversationData) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Save user message
    const { data: userMessage, error: userMessageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content,
        role: 'user'
      })
      .select()
      .single();

    if (userMessageError) {
      return res.status(400).json({ message: userMessageError.message });
    }

    // Get previous messages for context
    const { data: previousMessages } = await supabase
      .from('messages')
      .select('content, role')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10);

    // Generate AI response
    const aiResponseContent = await generateAIResponse(previousMessages, content);

    // Save AI response
    const { data: aiMessage, error: aiMessageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content: aiResponseContent,
        role: 'assistant'
      })
      .select()
      .single();

    if (aiMessageError) {
      return res.status(400).json({ message: aiMessageError.message });
    }

    // Update conversation's updated_at timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    res.status(201).json({
      userMessage,
      aiMessage
    });
  } catch (error) {
    next(error);
  }
};

// Delete a conversation
const deleteConversation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    // Verify the conversation belongs to the user
    const { data, error: findError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .single();

    if (findError || !data) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Delete all messages in the conversation first
    const { error: messagesError } = await supabase
      .from('messages')
      .delete()
      .eq('conversation_id', conversationId);

    if (messagesError) {
      return res.status(400).json({ message: messagesError.message });
    }

    // Delete the conversation
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    next(error);
  }
};
const getHome = (req, res) => {
  res.render('index'); // render views/index.ejs
};
//gửi request đến backend AI (Flask) và nhận phản hồi
const handleChat = async (req, res) => {
  const userMessage = req.body.message;
  try {
    const FlaskResponse = await axios.post('http://localhost:8080/rag', { msg: userMessage });
    res.json({ answer: FlaskResponse.data.answer });
  } catch (error) {
    console.error("Lỗi khi gọi Flask", error);
    res.status(500).json({ error: 'Lỗi khi gọi AI backend' });
  }
}
module.exports = {
    deleteConversation,
    getConversations,
    createConversation,
    getMessages,
    sendMessage,
    getHome,
    handleChat
}