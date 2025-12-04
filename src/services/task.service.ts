import { Task } from "../models/Task.model.js";

//* Creates a new task service function
export const createTask = async (title: string) => {
  return Task.create({ title });
};
