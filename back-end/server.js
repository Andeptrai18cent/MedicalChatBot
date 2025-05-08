const express = require('express');
// const cors = require('cors');
const viewConfig = require('./config/viewConfig');
// const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
// Route imports
// const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

// // Middleware imports
// const { errorHandler } = require('./middleware/errorMiddleware');
// const { authMiddleware } = require('./middleware/authMiddleware');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
viewConfig(app);
// Middleware
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' 
//     ? process.env.CLIENT_URL 
//     : 'http://localhost:5173',
//   credentials: true
// }));
app.use(express.json());
// app.use(cookieParser());

// Routes
// app.use('/api/auth', authRoutes);
app.use('/', chatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
// app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;