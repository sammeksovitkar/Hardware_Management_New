// index.js (or server.js) - Main Entry File

// 🌟 ADDED: Require dotenv config at the very top 🌟
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Keep this
const bodyParser = require('body-parser');

const app = express();

// --- 🛠️ UPDATED CORS CONFIGURATION ---

// 1. Define the specific origin(s) that are allowed to access your API
// This is your known front-end application domain.
const allowedOrigin = 'https://dist-court-nashik.vercel.app'; 

// 2. Create the CORS options object
const corsOptions = {
    // Set the specific allowed origin from the variable above
    origin: allowedOrigin,
    
    // Allow the most common methods, including OPTIONS (required for preflight checks)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    
    // Specify the headers the client might send (especially important for Authorization)
    allowedHeaders: ['Content-Type', 'Authorization'], 
    
    // IMPORTANT: Allow cookies and authentication headers (if you are using session/token-based auth)
    credentials: true, 
    
    // Set the status code for successful OPTIONS requests (fixes issues with some older clients)
    optionsSuccessStatus: 200 
};

// --- END CORS CONFIGURATION ---


// Middleware
app.use(bodyParser.json());

// 💡 APPLY THE CONFIGURED CORS MIDDLEWARE
app.use(cors(corsOptions)); 


// Database Connection
const connectDB = require('./db');

connectDB().catch(err => console.error(err));


// Routes
// Note: You might need to adjust these paths if your routes are not in the same directory.
// For Vercel, the routes will be relative to the root of your project.
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


const PORT = process.env.PORT || 5000; // Use port 5000 or whatever is in your .env file

// Start the server only when the file is run directly (not when imported by Vercel)
// if (require.main === module) {
//     app.listen(PORT, () => {
//         console.log(`Server is running on port ${PORT}`);
//         console.log(`Local URL: http://localhost:${PORT}`);
//     });
// }
// The key for Vercel: export the Express app as a serverless function
module.exports = app;
