import { CampaignRepo } from "../repos/campaignRepo.js";

export class CampaignService{
    private campaignRepo = new CampaignRepo();

    async createCampaign(sender:string,title:string,email:string,recipients:Array<string>){
        return this.campaignRepo.createCampaign(sender,title,email,recipients);
    }

    async updateRecipients(id:number,recipients:Array<string>){
        return this.campaignRepo.updateRecipients(id,recipients);
    }

    async updateTitle(id:number,title:string){
        return this.campaignRepo.updateTitle(id,title);
    }

    async updateEmail(id:number,email:string){
        return this.campaignRepo.updateEmail(id,email);
    }

    async checkPostId(id:number){
        return this.campaignRepo.findById(id);
    }

    async deleteDraft(id:number){
        return this.campaignRepo.deleteById(id);
    }
}