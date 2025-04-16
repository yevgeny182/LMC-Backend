const mongoose = require('mongoose')

const addCourseSchema = new mongoose.Schema({
    courseCode: String,
    courseTitle: String,
    population: Number,
    courseUnits: Number,
    courseStatus: String,
    students:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {timestamps: true})

const addCourse = mongoose.model('Course', addCourseSchema)
module.exports = addCourse
