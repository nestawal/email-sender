import dotenv from "dotenv";
import {Pool} from 'pg';

dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | undefined>{
    const result = await pool.query(text,params);
    return result.rows[0];
}

export async function queryMany<T = any>(text: string, params?: any[]): Promise<T[]>{
    const result = await pool.query(text, params);
    return result.rows;
}