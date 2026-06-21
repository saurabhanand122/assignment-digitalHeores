const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://saurabhanand122_db_user:CA55WyFFIgUnYNKi@cluster0.0d0lsh3.mongodb.net/resume_builder?appName=Cluster0';

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
const resumeRoutes = require('../routes/resumes');
app.use('/api/resumes', resumeRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Digital Heroes Resume Builder API is running',
    developer: 'Saurabh Anand',
    email: 'saurabh.anand122@gmail.com'
  });
});

// Database connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB database successfully');
  })
  .catch((err) => {
    console.error('MongoDB database connection error:', err);
  });

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
