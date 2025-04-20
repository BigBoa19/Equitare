import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, university } = req.body;
    
    // Validate input
    if (!name || !email || !password || !university) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }
    
    // Check for existing user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user with plain password (will be hashed in pre-save hook)
    user = new User({
      name,
      email,
      password,
      university
    });

    // Save user (triggers password hashing)
    await user.save();

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        
        // Return token and user data (excluding password)
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          university: user.university
        };
        res.json({ token, user: userData });
      }
    );
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check for existing user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Validate password using the User model's comparePassword method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        
        // Return token and user data (excluding password)
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          university: user.university
        };
        res.json({ token, user: userData });
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user's data
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    // User is already available from auth middleware
    res.json(req.userData);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, university } = req.body;
    
    // Find user and update
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, university },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 