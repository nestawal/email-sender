import { UserRepo } from "../repos/authRepo.js";

export class UserService{
    private userRepo = new UserRepo();

    async createUser(name: string,password: string,email: string){
        const oldUser = await this.userRepo.findByEmail(email)

        if(oldUser){
            throw new Error("User already exists cant create");
        }

        return await this.userRepo.createUser(email,name,password);
    }
}