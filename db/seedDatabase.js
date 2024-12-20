import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

import Course from '../models/course.js';
import Lesson from '../models/lesson.js';
import './connection.js'; // MongoDB connection file

const courseFilePath = path.resolve('./db/courseData.json');

const seedDatabase = async () => {
    try {
        // Read the course data file
        const courseData = JSON.parse(fs.readFileSync(courseFilePath, 'utf-8'));

        // Clear existing data
        await Course.deleteMany();
        await Lesson.deleteMany();

        // Loop through courses
        for (const course of courseData) {
            // Create a new course document
            const newCourse = await Course.create({
                name: course.name,
                department: course.department,
                description: course.description
            });

            // Create lessons and link them to the course
            const lessons = await Lesson.insertMany(
                course.lessons.map((lesson) => ({
                    name: lesson.name,
                    text: lesson.text,
                    course: newCourse._id
                }))
            );

            // Update course with lesson references
            newCourse.lessons = lessons.map((lesson) => lesson._id);
            await newCourse.save();
        }

        console.log('Database seeded successfully!');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
    }
};

seedDatabase();
