import mongoose from "mongoose";


const todoSchema = new mongoose.Schema({
    text:{
        type: String,
        required: true
    },
    dueDate:{
        type: String,
    },
    isComplete:{
        type: Boolean,
        required: true
    } 
})

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    hashedPassword:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    courses:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    todos:[{
        type: todoSchema,
    }]
})

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
      delete returnedObject.hashedPassword;
    },
  });

const User = mongoose.model('User', userSchema)

export default User