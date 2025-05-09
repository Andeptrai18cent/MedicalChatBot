const connection = require('./config/supabase');
const express = require('express');
const viewConfig = require('./config/viewConfig');
const dotenv = require('dotenv');
const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
viewConfig(app);


app.use(express.json());
app.use('',authRoutes);
app.use('', chatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;