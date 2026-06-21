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

// Database connection cache
let cachedConnection = null;
let cachedPromise = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (mongoose.connection.readyState === 1) {
    cachedConnection = mongoose.connection;
    return cachedConnection;
  }

  if (!cachedPromise) {
    // Disable Mongoose query buffering so database queries fail immediately if connection is not ready
    mongoose.set('bufferCommands', false);
    
    cachedPromise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000 // Quick timeout to handle whitelisting issues gracefully
    }).then((mongooseInstance) => {
      console.log('Connected to MongoDB database successfully');
      return mongooseInstance.connection;
    }).catch((err) => {
      cachedPromise = null;
      console.error('MongoDB database connection error:', err);
      throw err;
    });
  }

  cachedConnection = await cachedPromise;
  return cachedConnection;
}

// Database Connection Middleware
app.use(async (req, res, next) => {
  // Skip DB connection checks for root API details page
  if (req.path === '/') {
    return next();
  }
  
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    res.status(500).json({ 
      error: 'Database connection failed: ' + err.message,
      detail: 'Please ensure that your MongoDB Atlas cluster has "Allow Access from Anywhere" (IP address 0.0.0.0/0) enabled in the Network Access tab, and verify that the database credentials/connection string are correct.'
    });
  }
});

// Routes
const resumeRoutes = require('../routes/resumes');
const aiRoutes = require('../routes/ai');
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Digital Heroes Resume Builder API is running',
    developer: 'Saurabh Anand',
    email: 'saurabh.anand122@gmail.com'
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
