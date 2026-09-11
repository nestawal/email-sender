import { queryOne } from "../db.js";

export class CampaignRepo{
    createCampaign(sender:string,title:string,email:string,recipients:Array<string>){
        return queryOne(
            "INSERT INTO campaign (sender,title,email,recipients) VALUES($1,$2,$3,$4) RETURNING *",
            [sender,title,email,recipients]
        );
    };


}