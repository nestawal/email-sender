import { queryOne } from "../db.js";


export class UserRepo{
    createUser(email: string, name: string, password: string) {
        return queryOne(
            'INSERT INTO users(email,name,password) VALUES($1,$2,$3) RETURNING *',
            [email, name, password]
        );

    };

    findByEmail(email: string){
        return queryOne('SELECT id, email, name FROM users WHERE email = $1', [email]);
    }
}