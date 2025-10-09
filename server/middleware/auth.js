import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    console.log('Authorization header:', authHeader);
    
    const token = authHeader?.replace('Bearer ', '');
    console.log('Token from header:', token);
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }
    
    // Verify token
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    console.log('Found user:', user);
    
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. User not found.' 
      });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired.' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Authentication error.' 
    });
  }
};