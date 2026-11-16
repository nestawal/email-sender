import "dotenv/config";
import bcrypt from "bcrypt";
import { pool } from "../db.js";

async function main() {
    const { rows } = await pool.query(
        "SELECT email, password FROM users WHERE email = $1",
        ["alice@example.com"]
    );

    if (rows.length === 0) {
        console.log("alice not found");
        return;
    }

    const stored = rows[0].password;
    console.log("prefix:", stored.slice(0, 7));
    console.log("compare:", await bcrypt.compare("secret123", stored));
}

main()
    .catch(err => console.error(err))
    .finally(() => pool.end());