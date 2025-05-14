const express = require('express')
const router = express.Router()
const Semester = require('../models/semester')
const semester = require('../models/semester')


router.post('/createSemester', async (req, res) => {
    try{
        const {startDate, endDate, schoolYear, isAddedBy, isDefault} = req.body
        if(!startDate || !endDate || !schoolYear){
            return res.status(400).json({message: 'fields are required'})
        }
        const semester = new Semester({startDate, endDate, schoolYear, isAddedBy, isDefault: isDefault || false});
        await semester.save()

        res.status(201).json(semester)
    }catch(err){
        console.log('Error: ', err)
        res.status(500).json({message: 'Error in Server'})
    }
})

router.get('/getSemester', async (req, res) => {
    try{
        const sems = await Semester.find().populate('isAddedBy', 'name email')
        res.status(200).json(sems)
    }catch(err){
        console.log('Error: ', err)
        res.status(500).json({message: 'Server error'})
    }
})

router.delete('/deleteSemester/:id', async (req, res) => {
    try{
        const semToDelete = await Semester.findByIdAndDelete(req.params.id)
            if(!semToDelete)
                return res.status(404).json({message: 'Semester not found'})
            res.status(200).json({message: 'Semester deleted successfully'})
    }catch(err){
        console.error(err)
        res.status(500).json({message: 'Server Errror, Fail to delete semester'})
    }
})

router.put('/updateSemester/:id', async(req, res) => {
    try{
        const {schoolYear, startDate, endDate, isDefault} = req.body
        if(isDefault)
            await Semester.updateMany({_id: {$ne: req.params.id} }, {isDefault: false})
        const update = await Semester.findByIdAndUpdate(req.params.id, 
            {schoolYear, startDate, endDate, isDefault}, 
            {new: true})
        if(!update)
            res.status(404).json({message: 'Semester not found'})
        res.status(200).json({message: 'Semester update successfully', semester: update})
    }catch(err){
        console.error(err)
        res.status(500).json({message: 'Server Error'})
    }
})

module.exports = router;