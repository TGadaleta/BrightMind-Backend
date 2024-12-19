import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})