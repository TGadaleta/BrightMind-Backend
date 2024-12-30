import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/verifyToken.js";

import Course from "../models/course.js";
import User from "../models/user.js";

const router = express.Router();

const SALT_LENGTH = 12;

//User signup and sign in
router.post("/signup", async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.json({ error: "Username already taken" });
    }
    const user = await User.create({
      username: req.body.username,
      hashedPassword: bcrypt.hashSync(req.body.password, SALT_LENGTH),
      email: req.body.email,
    });
    const token = jwt.sign(
      {
        username: user.username,
        _id: user._id,
        expiresIn: "1d",
      },
      process.env.JWT_SECRET
    );
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
      const token = jwt.sign(
        {
          username: user.username,
          _id: user._id,
          expiresIn: "1d",
        },
        process.env.JWT_SECRET
      );
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Users courses
router.get("/:userId/courses", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("courses");
    if (!user) {
      return res.status(403).send("Not a valid user");
    }
    const courses = user.courses;
    return res.json(courses);
  } catch (error) {}
});

router.put("/:userId/courses/:courseId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(403).send("Not a valid user");
    }
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId)
    if (user.courses.includes(courseId)) {
      return res.status(403).send("You are already enrolled in this course");
    }
    user.courses.push(courseId);
    course.users.push(userId)
    await user.save();
    await course.save();
    res.status(200).json(courseId);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:userId/courses/:courseId/drop", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(403).send("Not a valid user");
    }
    const course = req.params.courseId;
    if (!user.courses.includes(course)) {
      return res.status(403).send("You are not enrolled in this course");
    }
    const removeIndex = user.courses.findIndex(
      (id) => id.toString() === course
    );
    const removedCourse = user.courses.splice(removeIndex, 1);
    await user.save();
    res.status(200).json(removedCourse);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get(
  "/:userId/courses/:courseId/:lessonId",
  verifyToken,
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.courseId).populate(
        "lessons"
      );
      if (!course) {
        return res.status(403).send("This is not a valid course");
      }
      const lessonId = req.params.lessonId;
      const lesson = course.lessons.filter((lesson) => lesson.equals(lessonId));
      if (!lesson) {
        return res.status(403).send("This is not a valid lesson");
      }
      res.status(200).json(lesson);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

//Users todos
router.get("/:userId/todos", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(403).send("Not a valid user");
    }
    const todos = user.todos;
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/:userId/todos", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(403).send("Not a valid user");
    }
    user.todos.push(req.body)
    await user.save()
    res.status(200).json();
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
});

router.put("/:userId/todos/:todoId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(403).send("Not a valid user");
    }
    const todo = user.todos.id(req.params.todoId)
    if (!todo) {
        return res.status(403).send("Not a valid todo")
    }
    todo.text = req.body.text
    todo.isComplete = req.body.isComplete
    await user.save()
    res.status(200).json(todo)
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:userId/todos/:todoId", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
          return res.status(403).send("Not a valid user");
        }
        const todo = user.todos.id(req.params.todoId)
        if (!todo) {
            return res.status(403).send("Not a valid todo")
        }
        const deletedTodo = user.todos.remove({ _id: todo._id })
        await user.save()
        res.status(200).json(deletedTodo)
    } catch (error) {
        res.status(500).json(error);
    }
})

export default router;
