import { pool } from "./index";

export async function initDB() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        company TEXT NOT NULL,
        role TEXT NOT NULL,
        status TEXT DEFAULT 'Applied',
        date_applied TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
        )    
    `)

    console.log("Jobs table ready");
}