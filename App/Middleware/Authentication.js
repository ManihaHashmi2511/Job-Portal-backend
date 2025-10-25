const jwt = require('jsonwebtoken');
const User = require('../Models/User.model');

const isAuthenticated = async (req, res, next) => {
  try {
    console.log('Authentication check: Cookies received:', req.cookies);
    const token = req.cookies.token;
    if (!token) {
      console.log('No token found in cookies');
      return res.status(401).json({ message: "Unauthorized Access" });
    }

    console.log('Token found, verifying...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);

    if (!decoded) {
      console.log('Token verification failed');
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.userId); // 👈 use userId here
    console.log('User found:', user ? user._id : 'No user');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // save user object
    console.log('Authentication successful for user:', user._id);
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = isAuthenticated;




    // const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // if (!decoded) {
    //   return res.status(401).json({ message: "Invalid token" });
    // }

    // const user = await User.findById(decoded.userId); // 👈 use userId here
    // if (!user) {
    //   return res.status(404).json({ message: 'User not found' });
    // }

    // req.user = user; // save user object


