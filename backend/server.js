require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB, sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Helmet removed to allow all third party media embeds without CORP policies.
// Allow any origin so ngrok tunnels work out of the box
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','OPTIONS'] }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body Parsing
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const songRoutes = require('./routes/songRoutes');
const libraryRoutes = require('./routes/libraryRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/library', libraryRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MoodTunes API is running' });
});

// Serve frontend in production (compiling both to one port)
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Start Server
const startServer = async () => {
  await connectDB();
  
  // Sync DB (Use forced sync only in dev if rebuilding tables)
  // await sequelize.sync({ force: true });
  await sequelize.sync();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
