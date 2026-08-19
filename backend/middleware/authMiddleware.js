const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'dev_jwt_secret_ai_interview_coach_key_987654321'
      );

      // Attempt DB lookup if Mongoose is connected
      if (User.db && User.db.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
      }
      
      if (!req.user) {
        req.user = {
          _id: decoded.id,
          id: decoded.id,
          name: decoded.name || 'Developer User',
          email: decoded.email || 'user@example.com',
          role: decoded.role || 'user',
          targetRole: decoded.targetRole || 'Software Engineer',
          targetCompany: decoded.targetCompany || 'Tech Corp',
        };
      }

      next();
    } catch (error) {
      console.error('Auth token verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token validation failed',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin privileges required',
    });
  }
};

module.exports = { protect, adminOnly };
