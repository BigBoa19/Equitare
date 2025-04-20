import express from 'express';
import mongoose from 'mongoose';
import Ride from '../models/Ride.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js'; // Import auth middleware

const router = express.Router();

// @route   GET /api/rides
// @desc    Get all rides
// @access  Public
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find({}).populate('user', 'name email');
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/rides/:id
// @desc    Get ride by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate('user', 'name email');
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    res.json(ride);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Ride not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/rides
// @desc    Create a new ride
// @access  Private (requires authentication)
router.post('/', auth, async (req, res) => {
  try {
    const { university, airport, departureDate, departureTime, maxPassengers } = req.body;
    
    // Get the user info to access their name
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const newRide = new Ride({
      user: req.user.id, // Use authenticated user's ID
      creatorName: user.name, // Add the creator's name
      university,
      airport,
      departureDate,
      departureTime,
      maxPassengers: maxPassengers || 3
    });

    const savedRide = await newRide.save();
    res.status(201).json(savedRide);
  } catch (error) {
    console.error('Create ride error:', error);
    res.status(500).json({ message: 'Failed to create ride' });
  }
});

// @route   PUT /api/rides/:id
// @desc    Update a ride
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    // Check if user owns this ride
    if (ride.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this ride' });
    }
    
    const updatedRide = await Ride.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.json(updatedRide);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/rides/:id
// @desc    Delete a ride
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    // Check if user owns this ride
    if (ride.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this ride' });
    }
    
    await ride.deleteOne();
    
    res.json({ message: 'Ride removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router; 