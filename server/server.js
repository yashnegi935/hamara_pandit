const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const astrologyRoutes = require('./routes/astrologyRoutes');
const gemstoneRoutes = require('./routes/gemstoneRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load env vars from root directory first, then fallback to local server directory
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/astrology', astrologyRoutes);
app.use('/api/gemstones', gemstoneRoutes);

// Alias Routes for specific API naming requested
app.post('/api/chart/generate', (req, res, next) => {
  require('./controllers/astrologyController').generateRecommendation(req, res, next);
});
app.post('/api/recommendation', (req, res, next) => {
  require('./controllers/astrologyController').generateRecommendation(req, res, next);
});
app.get('/api/reports', require('./middleware/authMiddleware').protect, (req, res, next) => {
  require('./controllers/astrologyController').getUserHistory(req, res, next);
});
app.get('/api/reports/:id', (req, res, next) => {
  require('./controllers/astrologyController').getReportDetails(req, res, next);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GemGuide AI API is running smoothly' });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('GemGuide AI API is running in development mode.');
  });
}

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
