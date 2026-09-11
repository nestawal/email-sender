import {Router} from "express";
import userRoute from "./userRoutes.js";
import campaignRoute from "./campaignRoutes.js"

const router = Router();

router.use("/users",userRoute);
router.use("/campaign",campaignRoute)

export default router;
