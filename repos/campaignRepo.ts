import { queryOne } from "../db.js";

export class CampaignRepo{
    async createCampaign(sender:string,title:string,email:string,recipients:Array<string>){
        return queryOne(
            "INSERT INTO campaign (sender,title,email,recipients) VALUES($1,$2,$3,$4) RETURNING *",
            [sender,title,email,recipients]
        );
    }

    //UI will handle the list locally
    async updateRecipients(id:number,recipients:Array<string>){
        return queryOne(
            "UPDATE campaign SET recipients = $1 WHERE id = $2 RETURNING *",
            [recipients,id]
        );
    }

    async updateTitle(id:number,title:string){
        return queryOne(
            "UPDATE campaign SET title = $1 WHERE id = $2 RETURNING *",
            [title,id]
        );
    }

    async updateEmail(id:number,email:string){
        return queryOne(
            "UPDATE campaign SET email = $1 where id = $2 RETURNING *",
            [email,id]
        );
    }



    async findById(id: number){
        return queryOne('SELECT * FROM campaign WHERE id = $1', [id]);
    }

    async deleteById(id: number){
        return queryOne("DELETE FROM campaign WHERE id=$1 RETURNING *",[id]);
    }

}