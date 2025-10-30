// // db.js
// const mongoose = require('mongoose');

// let isConnected = false;

// const connectDB = async () => {
//   if (isConnected) return;

//   if (!process.env.MONGO_URI) {
//     throw new Error("MONGO_URI is not defined");
//   }

//   const db = await mongoose.connect(process.env.MONGO_URI+process.env.DIST, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   isConnected = db.connections[0].readyState;
//   console.log("✅ MongoDB Connected");
// };

// module.exports = connectDB;

// ./db.js (Vercel-Safe Connection)

const mongoose = require('mongoose');

// Define a global cache object to reuse the connection across function invocations
let cached = global.mongoose;

// Initialize the cache if it doesn't exist
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // 1. Return cached connection if one exists
  if (cached.conn) {
    console.log('✅ Using cached MongoDB connection.');
    return cached.conn;
  }
  
  // 2. Create a new connection promise if none exists
  if (!cached.promise) {
    // Check for URI and handle connection options
    if (!process.env.MONGO_URI || !process.env.DIST) {
        throw new Error("MONGO_URI or DIST environment variable is not defined.");
    }

    const fullUri = process.env.MONGO_URI + process.env.DIST;
    
    // Note: 'useNewUrlParser' and 'useUnifiedTopology' are deprecated/ignored in modern Mongoose (v6+)
    const opts = {
        bufferCommands: false, // Recommended for Vercel
        // Other options can go here if needed
    };

    // Store the connection promise
    cached.promise = mongoose.connect(fullUri, opts)
      .then((mongooseInstance) => {
        console.log('✅ New MongoDB connection established.');
        return mongooseInstance;
      });
  }
  
  // 3. Wait for the connection promise to resolve and store the connection object
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    // If connection fails, clear the promise so a new attempt can be made next time
    cached.promise = null; 
    throw e;
  }
};

module.exports = connectDB;
