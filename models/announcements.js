const mongoose = require('mongoose')

const announcementsSchema = new mongoose.Schema({
    courseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    text: String,
    viewedBy: String,
    fileName: String,
    url: String, 
}, {timestamps: true})

const announce = mongoose.model('Announcement', announcementsSchema)
module.exports = announce