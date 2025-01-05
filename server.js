import cors from 'cors'
import './db/connection.js'
import dotenv from 'dotenv'
import morgan from 'morgan'
import express from 'express'

import userRouter from './controllers/user.js'
import coursesRouter from './controllers/courses.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use('/users', userRouter)
app.use('/courses', coursesRouter)

app.get('/', (req, res) => {
    res.json({message: 'Your app is working'})
  })

app.listen(PORT, () => {
    console.log('The express app is ready!')
})