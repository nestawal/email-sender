import { UserRepo } from "../repos/authRepo.js";

export class UserService{
    private userRepo = new UserRepo();

    async createUser(email: string,name: string,password: string){
        const oldUser = await this.userRepo.findByEmail(email)

        if(oldUser){
            throw new Error("User already exists cant create");
        }

        return await this.userRepo.createUser(email,name,password);
    };

    async loginUser(email: string,password: string){
        const goodMail = email.toLowerCase().trim();
        const oldUser = await this.userRepo.findByEmail(goodMail);

        if(!oldUser){
            throw new Error("User doesn't exist try to log in")
        }

        if(password !== oldUser.password){
            throw new Error("Wrong password try again");
        }else{
            return{id: oldUser.id,email: oldUser.email}
        }
    };
}