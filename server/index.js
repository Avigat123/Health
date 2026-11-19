import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import recordRoutes from './routes/recordRoutes.js';
import shareRoutes from './routes/shareRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/doctor', doctorRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'HealthVault API running ✅', timestamp: new Date() });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const server = app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${process.env.PORT || 5000} is already in use. Kill the old process and retry.`);
        process.exit(1);
      } else {
        throw err;
      }
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
