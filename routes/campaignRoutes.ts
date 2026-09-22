import { Router } from "express";
import {CampaignCont} from "../controllers/campaignCont.js";

const router = Router();
const campaignCont = new CampaignCont();

router.post("/createDraft",campaignCont.createDraft);
router.patch("/updateHandle",campaignCont.handleUpdates);
router.delete("/deleteDraft",campaignCont.deleteDraft);

export default router