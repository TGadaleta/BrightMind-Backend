import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    text:{
        type: String,
        required: true
    }
})

const Lesson = new mongoose.model('Lesson', lessonSchema)

export default Lesson