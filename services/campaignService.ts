import { CampaignRepo } from "../repos/campaignRepo.js";
import { emailQueue } from "../queues/emailQueue.js";

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

    //available statuses : 'draft', 'queued', 'sending', 'sent', 'failed'
    async sendCampaign(id:number){
        const campaign = await this.campaignRepo.findById(id);
        if(!campaign){throw new Error("Campaign non existant")}
        if(campaign.status !== "draft"){throw new Error("Already sent campaign")}
        if(!campaign.recipients.length){throw new Error("No recipients")}

        await this.campaignRepo.updateStatus(id,"queued");
        
        await emailQueue.add("send-campaign",{campaignId : id},{
            attempts: 3,
            backoff:{
                type: "exponential",
                delay: 5000
            }
        })

        console.log(`[Producer] Campaign #${id} added to the queue`);
        return campaign;
    }
}