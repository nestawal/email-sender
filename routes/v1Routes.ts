import {Router} from "express";
import userRoute from "./userRoutes.js";

const router = Router();

router.use("/users",userRoute);

export default router;
