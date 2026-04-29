const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {

  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

//fUVAwGFDrY0hO7DP
//43.242.103.97/32

