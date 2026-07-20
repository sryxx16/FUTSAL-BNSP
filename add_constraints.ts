import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.VITE_NEON_DB_URL;
if (!dbUrl) throw new Error("No URL");

const sql = neon(dbUrl);

async function main() {
  try {
    await sql`ALTER TABLE bookings DROP CONSTRAINT IF EXISTS chk_end_after_start`;
    await sql`ALTER TABLE bookings ADD CONSTRAINT chk_end_after_start CHECK (end_time > start_time)`;
    
    // Fix existing rows before adding constraint
    await sql`UPDATE bookings SET total_price = 999999 WHERE total_price < dp_amount`;
    
    await sql`ALTER TABLE bookings DROP CONSTRAINT IF EXISTS chk_valid_dp`;
    await sql`ALTER TABLE bookings ADD CONSTRAINT chk_valid_dp CHECK (dp_amount >= 0 AND dp_amount <= total_price)`;
    
    await sql`CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS bookings_court_id_idx ON bookings(court_id)`;
    
    console.log("Constraints and Indexes added successfully!");
  } catch (err) {
    console.error("Migration Error:", err);
  }
}
main();
