import '../models/lesson.js'
import express from 'express'
import Course from '../models/course.js'
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find({})
        res.status(200).json(courses)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/:courseId', async (req,res) => {
    try {
        const course = await Course.findById(req.params.courseId).populate('lessons')
        res.status(200).json(course)
    } catch (error) {
        res.status(500)
        console.log(error)
    }
})

router.post('/add', verifyToken, async (req,res) => {
    try {
        const newCourse = req.body
        const courses = await Course.find({})
        const repeatedCourse = courses.some(course => course.name === newCourse.name)
        if (repeatedCourse){
            return res.status(412).json( {message: "This class name already exists. Please pick a new one"} )
        }
        const addedCourse = await Course.create(
            {
                name: newCourse.name,
                department: newCourse.department,
                description: newCourse.description
            });
        return res.status(200).json(addedCourse)
    } catch (error) {
        res.status(500).json(error)
    }
})

export default router