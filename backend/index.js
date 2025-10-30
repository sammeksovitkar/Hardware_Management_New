// 🌟 ADDED: Require dotenv config at the very top 🌟
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// --- 🛠️ UPDATED CORS CONFIGURATION BLOCK ---
const allowedOrigin = 'https://dist-court-nashik.vercel.app'; 

const corsOptions = {
    origin: allowedOrigin,
    // Ensure all necessary methods, including OPTIONS for preflight, are allowed
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    // Specify the headers the client might send (Authorization is key for login)
    allowedHeaders: ['Content-Type', 'Authorization'], 
    // IMPORTANT: Allow cookies and authentication headers
    credentials: true, 
    optionsSuccessStatus: 200 
};

// Middleware
app.use(bodyParser.json());

// 1. APPLY THE CONFIGURED CORS MIDDLEWARE to all routes
app.use(cors(corsOptions)); 

// 2. 🌟 CRITICAL FIX: Explicitly handle preflight OPTIONS requests for ALL routes 🌟
// This forces the server to return the correct headers before routing logic can fail.
app.options('*', cors(corsOptions)); 


// Database Connection
const connectDB = require('./db');

// Note: Using the improved db.js file (below) makes the single call safer on Vercel
connectDB().catch(err => console.error("Database connection failed during startup:", err));


// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Root route for API status check
app.get('/', (req, res) => {
    res.send('Surety Member Management Backend API is running.');
});


const PORT = process.env.PORT || 5000; 

// Start the server only when run locally
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Local URL: http://localhost:${PORT}`);
    });
}

// The key for Vercel: export the Express app as a serverless function
module.exports = app;
