import { Router } from "express";
import { signin } from "../controllers/auth.controller.js";

//* Initialize Express router
const router = Router();
router.post("/auth/signin", signin);

export default router;
