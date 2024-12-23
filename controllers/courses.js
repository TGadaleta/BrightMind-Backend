import '../models/lesson.js'
import express from 'express'
import Course from '../models/course.js'

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

export default router