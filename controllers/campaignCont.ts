import type { Request,Response } from "express";
import { CampaignService } from "../services/campaignService.js";
import { error } from "console";

export class CampaignCont{
    private campaignService = new CampaignService();

    createDraft = async(req:Request,res:Response):Promise<void>=>{
      try{
        const {sender,title,email,recipients} = req.body;
        console.log(req.body)
        const result = await this.campaignService.createCampaign(sender,title,email,recipients);
        res.status(201).json({message: "Draft created", data:result})
      }catch(error:any){
        res.status(400).json({ error: error.message });
      }

    }


    handleUpdates = async(req:Request,res:Response):Promise<void>=>{
        try{
            const {id,title,email,recipients} = req.body;
            console.log(req.body);

            const post = await this.campaignService.checkPostId(id);
            if(!post){
                res.status(404).json({error : "No draft exists with that ID"});
            }

            let updatedPost = post;
            let hasChanges = false;

            if(title !== undefined && title !== post.title){
                updatedPost = await this.campaignService.updateTitle(id,title);
                hasChanges = true;
            }

            if(email !== undefined && email !== post.email){
                updatedPost = await this.campaignService.updateEmail(id,email);
                hasChanges = true;
            }

            if(recipients !== undefined && recipients !== post.recipients){
                updatedPost = await this.campaignService.updateRecipients(id,recipients);
                hasChanges = true;
            }

            if(!hasChanges){
                res.status(404).json({message : "No draft exists with that ID",data: post});
                return;
            }

            res.status(200).json({message : "Changes detected and updated",data: updatedPost});

        }catch(error:any){
            res.status(400).json({ error: error.message });
        }
    }

    deleteDraft = async(req:Request,res:Response):Promise<void>=>{
        try{
            const {id} = req.body;
            const post = await this.campaignService.deleteDraft(id);

            if(post){
                res.status(200).json({message:`post ${id} was deleted succesfully`});
            }
        }catch(error:any){
             res.status(400).json({ error: error.message });
        }
    }
}