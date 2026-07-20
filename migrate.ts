import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.VITE_NEON_DB_URL;
if (!dbUrl) throw new Error("No URL");

const sql = neon(dbUrl);

async function main() {
  await sql`ALTER TABLE reservasi ADD COLUMN IF NOT EXISTS nominal_dp DECIMAL(10,2) DEFAULT 0`;
  await sql`ALTER TABLE pelanggan ADD COLUMN IF NOT EXISTS no_hp VARCHAR(20) DEFAULT ''`;
  console.log("Migration Success");
}
main();
