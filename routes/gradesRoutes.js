const express = require('express')
const router = express.Router()
const GradesModel = require('../models/grades')
const userModel = require('../models/register')
const notification = require('../models/notification')
const courseModel = require('../models/courses')

router.post('/saveGrades', async(req, res) => {
    try{
       const {submittedBy, grades} = req.body
       if(!submittedBy) return res.status(400).json({error: 'Missing admin grade submittor'})
        const savedByUser = await userModel.findById(submittedBy)
       if(!savedByUser) return res.status(404).json({error: 'User not found'})

        const savedName = savedByUser.name
        
        for(const mark of grades){
            const subject = await courseModel.findById(mark.courseId)
            const courseCode = subject?.courseCode || 'error course'
            const courseTitle = subject?.courseTitle || 'error title'
            await GradesModel.findOneAndUpdate({
                studentId: mark.studentId,
                courseId: mark.courseId
            },
            {
                midterm: mark.midterm,
                final: mark.final,
                submittedBy: savedName,
                savedProgress: savedName,
            },
            {upsert: true, new: true}
        )
            if(mark.midterm && mark.midterm.trim() !== ''){
                 await notification.create({
                recipient: mark.studentId,
                message: `Your MIDTERM grade for the course [[${courseCode} - ${courseTitle}]]  has been submitted by ${savedName}. Your grade is (${mark.midterm})`,
                courseId: mark.courseId,
            })
        }
           if(mark.final && mark.final.trim() !== ''){
                 await notification.create({
                recipient: mark.studentId,
                message: `Your FINAL grade for the course [[${courseCode} - ${courseTitle}]] has been submitted by ${savedName}. Your grade is (${mark.final})`,
                courseId: mark.courseId,
            })
        }
    }
    console.log('Grade and notification sent!')
    res.status(201).json({message: 'Grades saved successfully!'})
        
    }catch(err){
        console.error('Server error', err)
        res.status(500).json({message: 'Failed to save grades'})
    }
})

router.get('/studentGrades/:courseId', async(req, res) => {
    try{
        const grade = await GradesModel.find({courseId: req.params.courseId})
        res.json(grade)
    }catch(err){
        console.error('Server error', err)
        res.status(500).json({message: 'Failed to fetch grades'})
    }
})

module.exports = router