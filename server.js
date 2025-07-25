require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

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


const userRoutes = require('./routes/userRoutes');
app.use('/', userRoutes);
const coursesRoute = require('./routes/courseRoutes')
app.use('/courses', coursesRoute)
const settingsRoute = require('./routes/settingsRoutes')
app.use('/settings', settingsRoute)
const notifyRoute = require('./routes/notificationRoutes')
app.use('/notify', notifyRoute)
const gradeRoute = require('./routes/gradesRoutes')
app.use('/grades', gradeRoute)
const announcementRoute = require('./routes/announcementRoutes')
app.use('/announcements', announcementRoute)

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
