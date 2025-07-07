const express = require('express')
const router = express.Router()
const Announcement = require('../models/announcements')

router.post('/createAnnouncement' , async (req, res) => {
    try{
        const {courseId, userId, text} = req.body

        if(!courseId || !userId || !text){
            return res.status(400).json({error: 'Missing fields'})
        }
        const newAnnouncement = new Announcement({
            courseId, userId, text
        })
        await newAnnouncement.save()
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

module.exports = router;