import { Router } from "express";
import { CampaignCont } from "../controllers/campaignCont.js";
import { auth } from "../middleware/auth.js";

const router = Router();
const campaignCont = new CampaignCont();

router.post("/",            auth, campaignCont.createDraft);
router.patch("/:id",        auth, campaignCont.handleUpdates);
router.delete("/:id",       auth, campaignCont.deleteDraft);
router.post("/:id/send",    auth, campaignCont.sendCampaign);

export default router;