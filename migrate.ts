import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.VITE_NEON_DB_URL;
if (!dbUrl) throw new Error("No URL");

const sql = neon(dbUrl);

async function main() {
  await sql`ALTER TABLE reservasi ADD COLUMN IF NOT EXISTS nominal_dp DECIMAL(10,2) DEFAULT 0`;
  console.log("Migration Success");
}
main();
