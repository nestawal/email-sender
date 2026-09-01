import { queryOne } from './database';

export async function createUser(email: string, name: string, password: string) {
    return queryOne(
        'INSERT INTO users(email,name,password) VALUES($1,$2,$3) RETURNING *',
        [email, name, password]
    );
}