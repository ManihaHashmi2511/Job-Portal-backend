const express = require('express');
const { applyJob, getAppliedJobs, getApplicants, updateJobStatus } = require('../Controllers/Application.Controller');
const isAuthenticated = require('../Middleware/Authentication');


const applicationRouter = express.Router();

applicationRouter.post('/apply/:id' , isAuthenticated , applyJob); // Fixed: Changed from GET to POST

applicationRouter.get('/getAppliedJobs', isAuthenticated, getAppliedJobs);

applicationRouter.get('/:id/applicants', isAuthenticated, getApplicants); // Fixed: Corrected typo from 'appliant' to 'applicants'

applicationRouter.post('/status/:id/update', isAuthenticated, updateJobStatus);

module.exports = applicationRouter;
 