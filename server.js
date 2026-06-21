import app from './app.js';
import mongoose from "mongoose";

const mongooseOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  maxIdleTimeMS: 30000,
  retryWrites: true,
};

let server;

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, mongooseOptions);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

const startServer = async () => {
  await dbConnection();

  const PORT = process.env.PORT || 5000;
  server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🕐 Started at: ${new Date().toISOString()}`);
  });
};

const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  // 1. Stop accepting new requests
  server.close(() => {
    console.log("🛑 Server stopped accepting new requests");

    // Wait for ongoing requests to finish 
    mongoose.connection.close()
      .then(() => {
        console.log("✅ MongoDB connection closed");
        process.exit(0);
      })
      .catch((error) => {
        console.error("❌ Error during MongoDB shutdown:", error);
        process.exit(1);
      });
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();
