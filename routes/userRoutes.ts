import { Router } from "express";
import { UserController } from "../controllers/authController.js";

const router = Router();
const userController = new UserController();

router.post("/users",userController.register);

export default router