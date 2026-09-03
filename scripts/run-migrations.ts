import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { pool } from '../db.js'; 

async function runAllMigrations() {
  const sqlDir = path.join(process.cwd(), 'sql');
  console.log(`Looking for SQL files in: ${sqlDir}`);

  try {
    if (!fs.existsSync(sqlDir)) {
      throw new Error(`The directory ${sqlDir} does not exist!`);
    }

    const files = fs.readdirSync(sqlDir).sort();
    console.log(`Found files:`, files);

    for (const file of files) {
      if (file.endsWith('.sql')) {
        const filePath = path.join(sqlDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');

        console.log(`Running migration: ${file}`);
        await pool.query(sql);
      }
    }

    console.log('All migrations executed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1); // Force npm to recognize the failure
  } finally {
    await pool.end();
  }
}

runAllMigrations();