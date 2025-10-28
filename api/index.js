const express = require('express');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const userRouter = require('../App/Routers/User.Routes');
const companyRouter = require('../App/Routers/Company.Routes');
const jobRouter = require('../App/Routers/Job.Routes');
const applicationRouter = require('../App/Routers/Application.Routes');
const serverLess = require('serverless-http');
require('dotenv').config();


const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse URL-encoded bodies
app.use(cors({
  origin: "https://job-portal-frontend-seven-jet.vercel.app", // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(cookieParser()); 
// to parse cookies


// api's Routes
app.use('/api/users', userRouter); //http://localhost:8000/api/users
app.use('/api/companies', companyRouter); //http://localhost:8000/api/companies
app.use('/api/jobs', jobRouter); //http://localhost:8000/api/jobs
app.use('/api/applications', applicationRouter); //http://localhost:8000/api/applications


mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
module.exports.handler = serverLess(app);
