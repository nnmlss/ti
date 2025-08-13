import 'dotenv/config';
import express from 'express';
import apiRouter from './routes/api.js';
import { connectDB } from './config/database.js';
import path from 'path';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Serve static images
app.use('/gallery', express.static(path.join(process.cwd(), 'gallery')));

// All API routes are mounted under /api
app.use('/api', apiRouter);

const startServer = async () => {
  await connectDB();

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
};

startServer().catch(console.error);
