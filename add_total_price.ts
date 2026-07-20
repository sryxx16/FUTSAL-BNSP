import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.VITE_NEON_DB_URL;
if (!dbUrl) throw new Error("No URL");

const sql = neon(dbUrl);

async function main() {
  try {
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2) DEFAULT 0`;
    console.log("Migration total_price Success");
  } catch (err) {
    console.error("Migration Error:", err);
  }
}
main();
