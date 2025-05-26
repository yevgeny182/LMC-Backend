const express = require('express')
const router = express.Router()
const notification = require('../models/notification')

router.post('/', async (req, res) => {
    try{
        const {recipient, message} = req.body
        if(!recipient || !message){
            res.status(400).json({message: 'Recipient and message are required'})
        }
        const newNotification = new notification({
            recipient,
            message,
            read: false,
            createdAt: new Date()
        })
        const savedNotification = await newNotification.save()
        console.log('Notification Sent')
        res.status(201).json(savedNotification)
    }catch(err){
        res.status(500).json({ message: 'Error creating notification' });
    }
})

router.get('/:userId', async (req, res) =>{
    try{
        const notif = await notification.find({recipient: req.params.userId})
        .sort({createdAt: -1})
        res.json(notif)
    }catch(err){
        res.status(500).json({message: 'Notification server error'})
    }
})

router.patch('/:notifId/read', async(req, res) =>{
    try{
        await notification.findByIdAndUpdate(req.params.notifId, {read: true})
        res.sendStatus(200)
    }catch(err){
        res.status(500).json({ message: 'Error marking as read' });
    }
})

module.exports = router