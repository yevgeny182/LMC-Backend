require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const registerModel = require('./models/register');
const bcrypt = require('bcrypt');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5048;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('MongoDB connection failed:', err));


app.use('/', userRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
