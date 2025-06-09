const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    recipient:{type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    message: String,
    read: {type: Boolean, default: false},
    createdAt:{type: Date, default:Date.now},
    courseId:{type: mongoose.Schema.Types.ObjectId, ref:'Course'}
})

const notify = mongoose.model('Notification', notificationSchema)
module.exports = notify 