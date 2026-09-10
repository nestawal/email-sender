import { queryOne } from "../db.js";

export class CampaignRepo{
    createCampaign(sender:string,title:string,email:string,recipients:Array<string>,){
        return queryOne(
            "INSERT INTO campaign(sender,email,recipients) VALUES($1,$2,$3) RETURNING *",
            [sender,email,recipients]
        );
    };
}