import { Task } from "../models/Task.model.js";
import { Request, Response } from "express";

//* Creates a new task and saves it to MongoDB
export const createTask = async (req: Request, res: Response) => {
  try {
    // TODO: Get title from request body instead of hardcoding
    const newTask = new Task({
      title: "labas pasauli",
    });

    // Save the task to database
    const savedMessage = await newTask.save();

    res.status(201).json({
      success: true,
      message: "Žinutė sukurta ir išsiųsta į MongoDB",
      data: savedMessage,
    });
  } catch (error) {
    // ! Handle error properly - log error details
    res.status(500).json({ error: "Klaida atliekant operaciją" });
  }
};
