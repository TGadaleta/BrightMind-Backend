import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

const router = express.Router();

const SALT_LENGTH = 12;

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
    const user = User.findOne({ username: req.body.username });
    if (user && bycrypt.compareSync(req.body.password, user.hashedPassword)) {
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

export default router;
