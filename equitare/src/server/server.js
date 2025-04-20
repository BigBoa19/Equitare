import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import rideRoutes from './routes/rideRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

// Connect to MongoDB
const db = await connectDB();

const app = express();

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Allow frontend URLs
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/rides', rideRoutes);
app.use('/api/auth', authRoutes);

// Basic route for API status
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API is running...',
    status: 'OK'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

// Export the app for testing/importing elsewhere
export default app;