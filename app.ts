import 'dotenv/config';
import express from 'express';
import apiRouter from './routes/api.js';
import { connectDB } from './config/database.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// All API routes are mounted under /api
app.use('/api', apiRouter);

const startServer = async () => {
  await connectDB();

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
};

startServer().catch(console.error);
