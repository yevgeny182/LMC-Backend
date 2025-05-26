const mongoose = require('mongoose')

const addCourseSchema = new mongoose.Schema({
    courseCode: String,
    courseTitle: String,
    population: Number,
    courseUnits: Number,
    courseStatus: String,
    semester: {type: mongoose.Schema.Types.ObjectId, ref: 'Semester'},
    students: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          isAddedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }
      ],
    teacher: [
      {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    ]
}, {timestamps: true})

const addCourse = mongoose.model('Course', addCourseSchema)
module.exports = addCourse
