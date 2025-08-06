import express from 'express';
import sitesRouter from './routes/sites.js';

const app = express();

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', sitesRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
