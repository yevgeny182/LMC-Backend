const express = require('express')
const router = express.Router()
const courseModel = require('../models/courses')
const userModel = require('../models/register')

//create new course for it to be populated by students
router.post('/addCourse', async (req, res) =>{
    try{
        const{
            courseCode,
            courseTitle,
            population,
            courseUnits,
            courseStatus,
            students,
            semester,
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
        students,
        semester
      });
  
      const savedCourse = await newCourse.save();
      res.status(201).json(savedCourse);
    } catch (err){
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
})

//table of displaying courses admins can create, users can join
router.get('/getCourses', async (req, res) => {
    try {
      const courses = await courseModel.find().populate('students', 'name email status role');
      res.status(200).json(courses);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch courses' });
    }
  });

//get course byId is to route to a different page for user to add, remove and view students
  router.get('/getCourse/:id', async(req, res) =>{
       try{
        const course = await courseModel.findById(req.params.id)
        .populate('students._id', 'name email status role')
        .populate('students.isAddedBy', 'name')
        .populate('semester', 'schoolYear startDate endDate')
        if(!course)return res.status(404).json({message: 'course not found'})
            res.status(200).json(course)
       } catch(err){
            console.error('Error: ', err);
            res.status(500).json({message: 'Failed to fetch course'})
       }
  })

//update the course details population, status and description
  router.put('/updateCourse/:id', async (req, res) => {
    try{
        const updated = await courseModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!updated) return res.status(404).json({message: 'Course not found'})
        res.status(200).json(updated)
    }catch (err){
        console.error(err)
        res.status(500).json({message: 'Failed to update course'})
    }
  })

  //delete the course created
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

//add singular users to course 
  router.post('/:courseId/addUser', async (req, res) => {
    const { courseId } = req.params;
    const { userId, addedBy } = req.body;

    try {
      const course = await courseModel.findById(courseId);
      if (!course) return res.status(404).send('Course not found');

      if (!course.students.includes(userId)) {
        course.students.push({ _id: userId, isAddedBy: addedBy });
        await course.save();
      }
  
      res.status(200).json({ message: 'User added to course' });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
});

//remove users in course
router.delete('/:courseId/removeUser', async (req, res) => {
  const { courseId } = req.params;
  const { userId } = req.body;

  try{
    const deleted = await courseModel.findById(courseId)
      if(!deleted) return res.status(404).json({message: 'user not found'})

      const userIndex = deleted.students.findIndex(
        (student) => student._id?.toString() === userId
      )

      if (userIndex === -1) return res.status(404).send('User not found in course');
  
      deleted.students.splice(userIndex, 1);
      await deleted.save();

      return res.status(200).json({message: 'remove from course'})
  }catch(err){
    console.log(err)
    res.status(500).send('server error')
  }
})


module.exports = router