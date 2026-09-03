import type {Request,Response} from "express";
import { UserService } from "../services/authService.js";

export class UserController{
    private userService = new UserService();

    register = async(req:Request,res:Response):Promise<void>=>{
        try{
            const {name,email,password} = req.body;

            if(!name || !email || !password){
                res.status(400).json({error: "Credentials missing are required "});
                return;
            }

            console.log(req.body)
            const newUser = await this.userService.createUser(name,email,password);
            res.status(201).json({message: "User creation succesful", data:newUser})
        }catch(error:any){
            res.status(400).json({error: error.message});
        }
    }
}