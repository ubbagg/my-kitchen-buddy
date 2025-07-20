const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Improved MongoDB connection for serverless
let isConnected = false;

const connectToDatabase = async () => {
  if (!isConnected) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      isConnected = true;
      console.log('📁 Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }
};

connectToDatabase().catch(console.error);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CORS_ORIGIN, 'https://my-kitchen-buddy-hnb7.vercel.app']
    : 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/meal-plans', require('./routes/mealPlans'));
app.use('/api/shopping-lists', require('./routes/shoppingLists'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'AI Recipe Generator API is running!',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Recipe Generator Backend API',
    endpoints: [
      '/api/auth',
      '/api/recipes', 
      '/api/meal-plans',
      '/api/shopping-lists'
    ]
  });
});

// Error handling middleware (must come before 404 handler)
app.use((error, req, res, next) => {
  console.error('Application Error:', error);
  res.status(500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
  });
});

// 404 handler - FIXED: Added parameter name after *
app.use('/*path', (req, res) => {
  res.status(404).json({ 
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      '/api/auth',
      '/api/recipes',
      '/api/meal-plans', 
      '/api/shopping-lists'
    ]
  });
});

// Export for Vercel
module.exports = app;

// Only listen in development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
