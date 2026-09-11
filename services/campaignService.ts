import { CampaignRepo } from "../repos/campaignRepo.js";

export class CampaignService{
    private campaignRepo = new CampaignRepo();

    async createCampaign(sender:string,title:string,email:string,recipients:Array<string>){
        return this.campaignRepo.createCampaign(sender,title,email,recipients);
    }
}