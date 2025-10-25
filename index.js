const express = require('express');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const userRouter = require('./App/Routers/User.Routes');
const companyRouter = require('./App/Routers/Company.Routes');
const jobRouter = require('./App/Routers/Job.Routes');
const applicationRouter = require('./App/Routers/Application.Routes');
const path = require('path');
require('dotenv').config();


const app = express();

const _dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse URL-encoded bodies
app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
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

app.use(express.static(path.join(_dirname, '/Frontend/dist')));
app.use(/.*/, (req, res) => {
  res.sendFile(path.resolve(_dirname, 'Frontend', 'dist', 'index.html'));
});





const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});
