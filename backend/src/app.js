require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('express-async-errors'); // To handle async errors in express routes

const audicaoRoutes = require('./routes/audicaoRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/audicoes', audicaoRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
