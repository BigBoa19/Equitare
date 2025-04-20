import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  university: {
    type: String,
    required: true
  },
  airport: {
    type: String,
    required: true
  },
  departureDate: {
    type: Date,
    required: true
  },
  departureTime: {
    type: String,
    required: true
  },
  maxPassengers: {
    type: Number,
    default: 3
  },
  currentPassengers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['open', 'full', 'completed', 'cancelled'],
    default: 'open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Ride = mongoose.model('Ride', rideSchema);

export default Ride; 