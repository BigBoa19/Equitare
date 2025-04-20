import express from 'express';
import mongoose from 'mongoose';
import Message from '../models/Message.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/messages
// @desc    Get all messages for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Get the current user's ID from auth middleware
    const userId = req.user.id;
    
    // Find all messages where the user is either the sender or recipient
    const messages = await Message.find({
      $or: [
        { sender: userId },
        { recipient: userId }
      ]
    })
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate('sender', 'name email') // Populate sender details
      .populate('recipient', 'name email') // Populate recipient details
      .populate('rideId', 'departureDate departureTime airport') // Populate ride details if present
      .exec();
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error while fetching messages' });
  }
});

// @route   GET /api/messages/conversations
// @desc    Get list of conversations for the logged-in user
// @access  Private
router.get('/conversations', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all messages where the user is either sender or recipient
    const messages = await Message.find({
      $or: [
        { sender: userId },
        { recipient: userId }
      ]
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name')
      .populate('recipient', 'name')
      .exec();
    
    // Create a map of conversations keyed by the other user's ID
    const conversationsMap = new Map();
    
    messages.forEach(message => {
      // Determine which user is the other party in the conversation
      const otherPartyId = message.sender._id.toString() === userId 
        ? message.recipient._id.toString() 
        : message.sender._id.toString();
      
      const otherPartyName = message.sender._id.toString() === userId
        ? message.recipient.name
        : message.sender.name;
      
      // If this conversation is not in our map yet, add it
      if (!conversationsMap.has(otherPartyId)) {
        conversationsMap.set(otherPartyId, {
          userId: otherPartyId,
          name: otherPartyName,
          lastMessage: message.content,
          lastMessageDate: message.createdAt
        });
      }
    });
    
    // Convert the map to an array and sort by most recent message
    const conversations = Array.from(conversationsMap.values())
      .sort((a, b) => b.lastMessageDate - a.lastMessageDate);
    
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Server error while fetching conversations' });
  }
});

// @route   GET /api/messages/user/:userId
// @desc    Get conversation with a specific user
// @access  Private
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;
    
    // Validate that the other user exists
    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    // Find messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: otherUserId },
        { sender: otherUserId, recipient: currentUserId }
      ]
    })
      .sort({ createdAt: 1 }) // Sort by oldest first for chat view
      .populate('sender', 'name')
      .populate('recipient', 'name')
      .populate('rideId', 'departureDate departureTime airport')
      .exec();
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Server error while fetching conversation' });
  }
});

// @route   POST /api/messages
// @desc    Send a new message
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { recipientId, content, rideId } = req.body;
    
    // Validate request body
    if (!recipientId || !content) {
      return res.status(400).json({ message: 'Recipient and message content are required' });
    }
    
    // Validate that the recipient exists
    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({ message: 'Invalid recipient ID' });
    }
    
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }
    
    // Create the new message
    const newMessage = new Message({
      sender: req.user.id,
      recipient: recipientId,
      content,
      rideId: rideId || null
    });
    
    const savedMessage = await newMessage.save();
    
    // Populate the sender and recipient fields for the response
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate('sender', 'name')
      .populate('recipient', 'name')
      .exec();
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
});

export default router; 