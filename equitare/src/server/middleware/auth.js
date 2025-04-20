import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to authenticate and protect routes
 * Verifies the JWT token from the Authorization header
 * Sets the user in the request object
 */
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Set user ID in request
      req.user = decoded.user;
      
      // Get user data from database
      const user = await User.findById(req.user.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      // Add full user object to request
      req.userData = user;
      
      next();
    } catch (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ message: 'Token is not valid' });
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export default auth; 