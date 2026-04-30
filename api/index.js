const express = require('express');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const userRouter = require('../App/Routers/User.Routes');
const companyRouter = require('../App/Routers/Company.Routes');
const jobRouter = require('../App/Routers/Job.Routes');
const applicationRouter = require('../App/Routers/Application.Routes');
require('dotenv').config();
const connectDB = require('../App/db');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse URL-encoded bodies
app.use(cors(
  {
    origin: "https://job-portal-frontend-x2ke.vercel.app/",
  }
));
app.use(cookieParser());
// to parse cookies

// Middleware to connect to DB on each request (for serverless)
// app.use(async (req, res, next) => {
//   try {
//     await connectToDatabase();
//     next();
//   } catch (error) {
//     console.error('Database connection error:', error);
//     res.status(500).json({ message: 'Database connection failed' });
//   }
// });


app.get("/test", (req, res) => {
  res.send("Backend is alive 🚀");
});
// api's Routes
app.use('/api/users', userRouter); //http://localhost:8000/api/users
app.use('/api/companies', companyRouter); //http://localhost:8000/api/companies
app.use('/api/jobs', jobRouter); //http://localhost:8000/api/jobs
app.use('/api/applications', applicationRouter); //http://localhost:8000/api/applications

// Global error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Unhandled error:', err);
//   res.status(500).json({ message: 'Internal server error' });
// });

connectDB();

// app.listen(process.env.PORT || 5000, () => {
//   console.log(`Server running on port ${process.env.PORT || 5000}`);
// });

module.exports = app;
//  module.exports.handler = serverLess(app);
