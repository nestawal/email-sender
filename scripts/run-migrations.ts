
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { pool } from '../db.js';

async function runAllMigrations() {
    const sqlDir = path.join(process.cwd(), 'sql');

    await pool.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            filename VARCHAR(255) PRIMARY KEY,
            applied_at TIMESTAMP DEFAULT NOW()
        );
    `);

    const applied = await pool.query<{ filename: string }>(
        'SELECT filename FROM schema_migrations'
    );
    const appliedSet = new Set(applied.rows.map(r => r.filename));

    const files = fs.readdirSync(sqlDir).filter(f => f.endsWith('.sql')).sort();
    console.log(`Found ${files.length} migration files.`);

    for (const file of files) {
        if (appliedSet.has(file)) {
            console.log(`⏭  ${file} (already applied)`);
            continue;
        }

        const sql = fs.readFileSync(path.join(sqlDir, file), 'utf8');
        console.log(`show  ${file}`);
        try {
            await pool.query('BEGIN');
            await pool.query(sql);
            await pool.query('INSERT INTO schema_migrations(filename) VALUES($1)', [file]);
            await pool.query('COMMIT');
            console.log(`done ${file}`);
        } catch (err) {
            await pool.query('ROLLBACK');
            throw err;
        }
    }

    console.log('All migrations executed.');
}

runAllMigrations()
    .catch(err => { console.error('Migration failed:', err); process.exit(1); })
    .finally(() => pool.end());