import type { Request,Response } from "express";
import { CampaignService } from "../services/campaignService.js";

export class CampaignCont{
    private campaignService = new CampaignService();

    postDraft = async(req:Request,res:Response):Promise<void>=>{
      try{
        const {sender,title,email,recipients} = req.body;
        console.log(req.body)
        const result = await this.campaignService.createCampaign(sender,title,email,recipients);
        res.status(201).json({message: "Draft created", data:result})
      }catch(error:any){
        res.status(400).json({ error: error.message });
      }

    }
}