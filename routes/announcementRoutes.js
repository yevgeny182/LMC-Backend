const express = require('express')
const router = express.Router()
const Announcement = require('../models/announcements')
const courseModel = require('../models/courses')
const notification = require('../models/notification')
const userModel = require('../models/register')

router.post('/createAnnouncement' , async (req, res) => {
    try{
        const {courseId, userId, text, fileName, url} = req.body
        const savedByUser = await userModel.findById(userId)
        if(!savedByUser) return res.status(404).json({error: 'User not found'})

        const announcer = savedByUser.name
        if(!courseId || !userId || !text){
            return res.status(400).json({error: 'Missing fields'})
        }
        const newAnnouncement = new Announcement({
            courseId, userId, text, fileName, url
        })
        await newAnnouncement.save()

        const course = await courseModel.findById(courseId)
        if(!course || !course.students || course.students.length === 0){
            return res.status(404).json({error: 'Course or students not found'})
        }

        const notifications = course.students.map(student => ({
            recipient: student._id,
            message: `You have a new announcement in [${course.courseCode}] by ${announcer}`,
            courseId: courseId,
        }))
        await notification.insertMany(notifications)
        console.log('[Announcement Module]: Notification sent!')
        res.status(201).json({message: 'Create announcement OK!',  data: newAnnouncement})
    }catch(err){
        console.error(err)
        res.status(500).json({error: 'Error in creating announcement'})
    }
})

router.get('/getAnnouncement' , async(req, res) => {
    try{
        const announcements = await Announcement.find().populate('courseId userId')
        res.json(announcements)
    }catch(err){
        console.error(err)
        res.status(500).json({error: 'Failed to fetch announcements'})
    }
})

router.delete('/deleteAnnouncement/:id', async(req, res) => {
    try{
    const announcementToDelete = await Announcement.findByIdAndDelete(req.params.id)
    if(!announcementToDelete)
        return res.status(404).json({message: 'Announcement not found'})

    res.status(200).json({message: 'Announcement deleted successfully!'})
    }catch(err){
        console.error(err)
        res.status(500).json({error: 'Failed to delete announcement'})
    }
})

module.exports = router;