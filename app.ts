import express from 'express';
import apiRouter from './routes/api.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// All API routes are mounted under /api
app.use('/api', apiRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
