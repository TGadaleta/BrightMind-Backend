import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import userRouter from './controllers/user.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})
app.use(cors());
app.use(express.json());

app.use('/users', userRouter)

app.listen(PORT, () => {
    console.log('The express app is ready!')
})