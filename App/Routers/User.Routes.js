const express = require("express");
const multer = require("multer");
const { register, login, logout, getProfile, updateProfile } = require("../Controllers/User.Controller.js");
const isAuthenticated = require("../Middleware/Authentication.js");

const userRouter = express.Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

userRouter.post("/register", upload.single("file"), register);

userRouter.post("/login", login);

userRouter.post("/logout", logout);

userRouter.get("/profile", isAuthenticated, getProfile);

userRouter.put("/updateProfile", isAuthenticated, upload.single("file"), updateProfile);

module.exports = userRouter;
