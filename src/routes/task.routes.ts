import { Router } from "express";
import * as taskController from "../controllers/task.controller.js";

//* Initialize Express router
const router = Router();

//* POST endpoint for creating a new task
router.post("/task", taskController.createTask);

export default router;
