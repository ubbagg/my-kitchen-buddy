const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,              
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Recipe Generator API is running!' });
});

// Import routes (we'll create these)
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});