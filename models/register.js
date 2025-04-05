const mongoose = require('mongoose')

const registerSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
    status: Boolean, //Active or Inactive
    role: { type: String, enum: ['Admin', 'Trainee'], required: true }
}, {timestamps: true})

const registration = mongoose.model('User', registerSchema) 
module.exports = registration