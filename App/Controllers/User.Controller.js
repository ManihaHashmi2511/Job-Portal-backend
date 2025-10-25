const User = require('../Models/User.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('../cloudinary');
const getDataUri = require('../datauri');
require('dotenv').config();


const register = async (req, res) => {
  const { fullName, email, password, phoneNumber, role } = req.body;
  if (!fullName || !email || !password || !phoneNumber || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "File is required" });
  }
  const fileUri = getDataUri(file);
  const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
  


  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    fullName,
    email,
    password: hashedPassword,
    phoneNumber,
    role,
    profile:{
      profilePicture: cloudResponse.secure_url
    }
  });

  return res.status(201).json({
    message: "You are registered successfully",
  });
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // role check
    if (role !== user.role) {
      return res.status(403).json({ message: "Access denied with this role" });
    }

    // Generate JWT token
    const tokenData = {
      userId: user._id,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "7d" });

    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
      })
      .json({
        message: ` Welome back ${user.fullName}`,
        user,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};   

const logout = (req, res) => {
  try {
    // ✅ Prevent caching of logout response
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // ✅ Clear the authentication cookie
    return res.status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "lax"
      })
      .json({
        message: "Logged out successfully",
        success: true
      });

  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const userProfile = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      user: userProfile,
      success: true
    });

  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    // ✅ req.user is coming from isAuthenticated middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // ✅ Get data from req.body (not req.file for text fields)
    const {fullName, email, phoneNumber, bio, skills} = req.body;
    const file = req.file; // ✅ Correct: get file from multer

    // ✅ Only process file if it exists and has buffer
    let cloudResponse = null;
    if (file && file.buffer) {
      try {
        const fileUri = getDataUri(file);
        cloudResponse = await cloudinary.uploader.upload(fileUri.content, { resource_type: 'raw' });
      } catch (error) {
        console.error("File upload error:", error);
        return res.status(500).json({
          message: "File upload failed",
          success: false
        });
      }
    } else if (file && !file.buffer) {
      console.error("File buffer is missing:", file);
      return res.status(400).json({
        message: "Invalid file upload - no file buffer found",
        success: false
      });
    }

    let skillsArray;
    if(skills){
      // ✅ Better parsing: trim whitespace and handle empty strings
      skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    }

    // ✅ Update user profile
    if(fullName) user.fullName = fullName;
    if(email) user.email = email;
    if(phoneNumber) user.phoneNumber = phoneNumber;
    if(bio) user.profile.bio = bio;
    if(skills) user.profile.skills = skillsArray;

    // ✅ Only update resume if file was uploaded successfully
    if(cloudResponse){
      user.profile.resume = cloudResponse.secure_url.replace('/image/', '/raw/');
      user.profile.resumeOriginalName = file.originalname;
    }

    // ✅ Don't forget to await the save operation
    await user.save();

    // ✅ Return clean user object
    const updatedUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      success: true
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile
};
