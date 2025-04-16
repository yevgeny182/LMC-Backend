const express = require('express')
const router = express.Router()
const courseModel = require('../models/courses')
const userModel = require('../models/register')

router.post('/addCourse', async (req, res) =>{
    try{
        const{
            courseCode,
            courseTitle,
            population,
            courseUnits,
            courseStatus,
            students
        } = req.body

    const allStudentExist = await Promise.all(
        students.map(async (stud) => {
            const user = await userModel.findById(stud.studentId)
            return !!user
        })
    )
    if (allStudentExist.includes(false)) {
        return res.status(400).json({ message: 'One or more student IDs are invalid.' });
      }
  
      const newCourse = new courseModel({
        courseCode,
        courseTitle,
        population,
        courseUnits,
        courseStatus,
        students
      });
  
      const savedCourse = await newCourse.save();
      res.status(201).json(savedCourse);
    } catch (err){
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
})

router.get('/getCourses', async (req, res) => {
    try {
      const courses = await courseModel.find().populate('students', 'name email status role');
      res.status(200).json(courses);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch courses' });
    }
  });

  router.get('/getCourse/:id', async(req, res) =>{
       try{
        const course = await courseModel.findById(req.params.id).populate('students', 'name email status role')
        if(!course)return res.status(404).json({message: 'course not found'})
            res.status(200).json(course)
       } catch(err){
            console.error('Error: ', err);
            res.status(500).json({message: 'Failed to fetch course'})
       }
  })
  
  router.put('updateCourse/:id', async (req, res) => {
    try{
        const updated = await courseModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!updated) return res.status(404).json({message: 'Course not found'})
        res.status(200).json(updated)
    }catch (err){
        console.error(err)
        res.status(500).json({message: 'Failed to update course'})
    }
  })

  router.delete('/deleteCourse/:id', async (req, res) => {
    try{
        const deleted = await courseModel.findByIdAndDelete(req.params.id)
        if(!deleted)
            return res.status(404).json({message: 'Course not found'})
        res.status(200).json({message: 'Course deleted successfully'})
    }catch(err){
        console.error(err)
        res.status(500).json({message: 'Failed to delete course'})
    }
  })

module.exports = router