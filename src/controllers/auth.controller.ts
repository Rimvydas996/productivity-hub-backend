import { User } from "../models/User.model.js";
import { Request, Response } from "express";
import { createUser } from "../services/auth.service.js";

//* Creates new user
export const signin = async (req: Request, res: Response) => {
  try {
    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!emailRegexp.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ $or: [{ name }, { email }] });
    if (existingUser) {
      if (existingUser.email === email) return res.status(409).json({ message: "Email is already in use" });
      if (existingUser.name === name) return res.status(409).json({ message: "Username is already in use" });
    }

    const newUser = await createUser(email, password, name);
    return res.status(201).json({
      message: "Created successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    // ! Handle error properly - log error details
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
