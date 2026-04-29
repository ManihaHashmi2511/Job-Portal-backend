const express = require('express');
const isAuthenticated = require('../Middleware/Authentication.js');
const { postJob, getAllJobs, getJobById, getAdminjobs, updateJob } = require('../Controllers/Job.Controller.js');

const jobRouter = express.Router();

jobRouter.post('/post-job', isAuthenticated, postJob);

jobRouter.get('/get', isAuthenticated, getAllJobs);

jobRouter.get('/get/:id', isAuthenticated, getJobById);
 
jobRouter.get('/getAdminJobs', isAuthenticated, getAdminjobs);

jobRouter.put('/update/:id', isAuthenticated, updateJob);

module.exports = jobRouter;