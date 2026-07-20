import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.VITE_NEON_DB_URL;
if (!dbUrl) throw new Error("No URL");

const sql = neon(dbUrl);

async function main() {
  try {
    // Rename Tables (Already Done)
    // await sql`ALTER TABLE pelanggan RENAME TO users`;
    // await sql`ALTER TABLE lapangan RENAME TO court`;
    // await sql`ALTER TABLE reservasi RENAME TO bookings`;

    // Rename Columns in users (Already Done)
    // await sql`ALTER TABLE users RENAME COLUMN nama TO name`;
    // await sql`ALTER TABLE users RENAME COLUMN no_hp TO phone`;

    // Rename Columns in court
    await sql`ALTER TABLE court RENAME COLUMN tipe TO type`;
    await sql`ALTER TABLE court RENAME COLUMN harga_per_jam TO price_per_hour`;

    // Rename Columns in bookings
    await sql`ALTER TABLE bookings RENAME COLUMN pelanggan_id TO user_id`;
    await sql`ALTER TABLE bookings RENAME COLUMN lapangan_id TO court_id`;
    await sql`ALTER TABLE bookings RENAME COLUMN tanggal TO date`;
    await sql`ALTER TABLE bookings RENAME COLUMN jam_mulai TO start_time`;
    await sql`ALTER TABLE bookings RENAME COLUMN jam_selesai TO end_time`;
    await sql`ALTER TABLE bookings RENAME COLUMN nominal_dp TO dp_amount`;
    
    console.log("Migration Rename Success");
  } catch (err) {
    console.error("Migration Error:", err);
  }
}
main();
