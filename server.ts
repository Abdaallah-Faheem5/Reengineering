import express = require('express');
require('dotenv').config();
import connectDB = require('./src/config/db.config.js');
import app = require('./src/app.js');
import { PORT } from './src/config/env.config.js';


const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server running`);

    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
