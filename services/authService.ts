import bcrypt from "bcrypt";
import { UserRepo } from "../repos/authRepo.js";

export class UserService{
    private userRepo = new UserRepo();

    async createUser(email: string, name: string, password: string) {
        const normalized = email.toLowerCase().trim();
        const oldUser = await this.userRepo.findByEmail(normalized);
        if (oldUser) throw new Error("Email already registered");

        const hash = await bcrypt.hash(password, 12);   // ← HASH
        return await this.userRepo.createUser(normalized, name, hash);
    }

    async loginUser(email: string,password: string){
        const goodMail = email.toLowerCase().trim();
        const oldUser = await this.userRepo.findByEmail(goodMail);

        if(!oldUser){
            throw new Error("User doesn't exist try to log in")
        }

         const ok = await bcrypt.compare(password, oldUser.password);
        if (!ok) {
            throw new Error("Invalid credentials");
        }

        return { id: oldUser.id, email: oldUser.email };
    };
}