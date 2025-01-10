import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name:{
        type: String,
        required: true
    },
    department:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    lessons:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
    }]
})

const Course = new mongoose.model('Course', courseSchema)

export default Course