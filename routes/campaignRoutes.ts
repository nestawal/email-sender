import { Router } from "express";
import {CampaignCont} from "../controllers/campaignCont.js";

const router = Router();
const campaignCont = new CampaignCont();

router.post("/postDraft",campaignCont.postDraft);

export default router