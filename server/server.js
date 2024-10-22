const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MongodbURL)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const categoryRoutes = require('./routes/category');
const novelRoutes = require('./routes/novel');
const chapterRoutes = require('./routes/chapter');
const rateRoutes = require('./routes/rate');

app.use('/api/categories', categoryRoutes);
app.use('/api/novels', novelRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/rates', rateRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
