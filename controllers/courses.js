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

router.post('/add', verifyToken, async (req, res) => {
    try {
        const { owner, name, department, description } = req.body;

        // Validate required fields
        if (!owner || !name || !department || !description) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check for duplicate course name
        const repeatedCourse = await Course.findOne({ name });
        if (repeatedCourse) {
            return res
                .status(412)
                .json({ message: "This class name already exists. Please pick a new one." });
        }

        // Create and save the new course
        const addedCourse = await Course.create({ owner, name, department, description });

        // Send success response
        return res.status(200).json(addedCourse);
    } catch (error) {
        console.error('Error adding course:', error); // Log the error for debugging
        return res.status(500).json({ message: "Internal server error. Please try again later." });
    }
});


export default router