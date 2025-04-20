import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  university: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  rides: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride'
  }],
  bookedRides: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Handle password hashing before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password along with the new salt
    this.password = await bcrypt.hash(this.password, salt);
    
    // Continue with saving
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // Use bcrypt to compare the provided password with the stored hash
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

export default User; 