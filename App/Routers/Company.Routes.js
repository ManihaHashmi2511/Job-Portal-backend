const express = require("express");
const isAuthenticated = require("../Middleware/Authentication.js");
const { registerCompany, getCompany, getCompanyById, updateCompany } = require("../Controllers/Company.Controller");
const multer = require("multer");


const companyRouter = express.Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});


companyRouter.post('/register',isAuthenticated, registerCompany);

companyRouter.get('/get',isAuthenticated, getCompany);

companyRouter.get('/get/:id', isAuthenticated, getCompanyById);

companyRouter.put('/update/:id', isAuthenticated,  upload.single("file"), updateCompany);

module.exports = companyRouter;

