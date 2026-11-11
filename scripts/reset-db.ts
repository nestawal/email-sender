// scripts/reset-db.ts
import "dotenv/config";
import { pool } from "../db.js";

const SQL = `
DROP TABLE IF EXISTS campaign;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE campaign (
    id SERIAL PRIMARY KEY ,
    sender VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    email TEXT NOT NULL,
    recipients VARCHAR(255)[] NOT NULL DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft','queued','sending','sent','failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

async function main() {
    console.log("Resetting database...");
    await pool.query(SQL);
    console.log(" Done. Tables recreated with UUID ids and status column.");
    await pool.end();
}

main().catch(err => { console.error(" Failed:", err); process.exit(1); });