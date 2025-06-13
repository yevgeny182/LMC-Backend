const mongoose = require('mongoose')

const gradeSchema = new mongoose.Schema({
    courseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true},
    studentId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    midterm: String,
    final: String,
    submittedBy: String,
    savedProgress: String,
    /* isGraded: Boolean, */
    isMidtermGraded:{type: Boolean, required: true, default: false},
    isFinalGraded: {type: Boolean, required: true, default: false},
}, {timestamps: true})

const studentGrades = mongoose.model('Grade', gradeSchema)
module.exports = studentGrades