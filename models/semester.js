const mongoose = require('mongoose')

const semesterSchema = new mongoose.Schema({
    startDate:{
        type: Date,
        required: true,
    },
    endDate:{
        type: Date,
        required: true,
    },
    schoolYear: String,
    isAddedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDefault: Boolean,
}, {timestamps: true})

const semester = mongoose.model('Semester', semesterSchema)
module.exports = semester