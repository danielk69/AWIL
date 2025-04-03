import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import dataRoutes from './routes/dataRoutes';
import { authenticateToken } from './middleware/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://awil-frontend.azurewebsites.net'
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', authenticateToken, dataRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to AWIL API' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 