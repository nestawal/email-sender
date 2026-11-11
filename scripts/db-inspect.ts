
import "dotenv/config";
import { pool } from "../db.js";

async function columnType(table: string, column: string) {
    const { rows } = await pool.query(
        `SELECT column_name, data_type, is_nullable, column_default
         FROM information_schema.columns
         WHERE table_name = $1 AND column_name = $2`,
        [table, column]
    );
    return rows[0] ?? null;
}

async function tableColumns(table: string) {
    const { rows } = await pool.query(
        `SELECT column_name, data_type, is_nullable, column_default
         FROM information_schema.columns
         WHERE table_name = $1
         ORDER BY ordinal_position`,
        [table]
    );
    return rows;
}

async function userRow(email: string) {
    const { rows } = await pool.query(
        `SELECT id, email, name, password, created_at FROM users WHERE email = $1`,
        [email.toLowerCase().trim()]
    );
    return rows[0] ?? null;
}

async function main() {
    console.log("=== users.id column ===");
    console.log(await columnType("users", "id"));

    console.log("\n=== users table (all columns) ===");
    console.table(await tableColumns("users"));

    console.log("\n=== campaign table (all columns) ===");
    console.table(await tableColumns("campaign"));

    console.log("\n=== alice@example.com row ===");
    const user = await userRow("alice@example.com");
    if (!user) {
        console.log("(not found)");
    } else {
        console.log({
            ...user,
            password: user.password
                ? user.password.startsWith("$2")
                    ? `${user.password.slice(0, 7)}... (bcrypt hash)`
                    : `${user.password} (⚠ PLAINTEXT)`
                : "(empty)",
        });
    }

    await pool.end();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});