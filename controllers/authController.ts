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
            const newUser = await this.userService.createUser(email,name,password);
            res.status(201).json({message: "User creation succesful", data:newUser})
        }catch(error:any){
            res.status(400).json({error: error.message});
        }
    }

    login = async(req:Request,res:Response)=>{
        try{
            const {email,password} = req.body;

            console.log(email,password);

            if(!email || !password){
                console.log("missing credetials for login")
            }

            const user = await this.userService.loginUser(email,password);

            return res.status(200).json({
                message: "Succesful login",
                data: user
            });
        }catch(error: any){
            return res.status(401).json({error: error.message});
        }
    }
}