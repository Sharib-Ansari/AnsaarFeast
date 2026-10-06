require('dotenv').config();
const express = require('express');
const connectDB = require('./db');

const app = express();
const port = process.env.PORT || 5000;

// CORS — fully driven by environment variable
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, auth-token'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('AnsaarFeast API is running.');
});

app.use('/api/auth', require('./Routes/Auth'));

connectDB(() => {
  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
});
