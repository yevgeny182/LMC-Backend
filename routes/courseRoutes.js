const express = require('express')
const router = express.Router()
const courseModel = require('../models/courses')
const userModel = require('../models/register')
const notification = require('../models/notification')

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
        .populate('teacher', 'name email role')
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
      const course = await courseModel.findById(courseId)
      if (!course) return res.status(404).send('Course not found');

      const alreadyEnrolled = course.students.some(
        (student) => student._id.toString() === userId
      )
      if(!alreadyEnrolled){
        course.students.push({_id: userId, isAddedBy: addedBy})
        await course.save()

        const studentEntry = course.students.find(
          (student) => student._id.toString() === userId
        )

      let addedByName = 'student';
      if (studentEntry?.isAddedBy) {
        const addedByUser = await userModel.findById(studentEntry.isAddedBy);
        if (addedByUser) {
          addedByName = addedByUser.name;
        }
      }
        await notification.create({
          recipient: userId,
          message: `You have been added to the course:[${course.courseCode} ${course.courseTitle}]by ${addedByName}`
        })
        console.log('Notification sent!')
        res.status(200).json({ message: 'User added and notified' });
      }else{
        res.status(200).json({ message: 'Student already enrolled in course' });
      }
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

router.put('/:courseId/assignTeacher', async(req, res) => {
  const {courseId} = req.params;
  const {teacherId} = req.body;
  try{
    const course = await courseModel.findById(courseId)
    if(!course)
      return res.status(404).json({message: 'course not found'})

      if(!course.teacher)
        course.teacher = []


    const alreadyAssigned = course.teacher.some((id) => id.toString() === teacherId)

    if(!alreadyAssigned){
    course.teacher.push(teacherId)
    await course.save()
     await notification.create({
      recipient: teacherId,
      message:`Admin: You are the assigned teacher for "${course.courseCode} ${course.courseTitle}" ` 
    })
 
    return res.status(200).json({message:'Teacher assigned to course success!'})
    }else{
      return res.status(409).json({message: 'Teacher already assigned!'})
    }

  }catch(err){
    console.error('Error assigning teacher', err)
    res.status(500).send('Server error')
  }
})

router.put('/:courseId/removeTeacher', async(req, res) => {
  const {courseId} = req.params;
  const {teacherId} = req.body;
  try{
    const course = await courseModel.findById(courseId)
    if(!course) 
      return res.status(404).json({message: 'course not found'})
    course.teacher = course.teacher.filter((id) => id.toString() !== teacherId)
    await course.save()
    res.status(200).json({message: 'Teacher removed from course'})
  }catch(err){
    console.error('Error removing teacher', err)
    res.status(500).send('Server error')
  }
})

module.exports = router