require('dotenv').config();
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://delauds-health.vercel.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json());

const corsOptions = {
  origin: 'https://delauds-health.vercel.app',
  credentials: true
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);

app.get('/', (req, res) => {
  res.send('Delauds Health Backend Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 