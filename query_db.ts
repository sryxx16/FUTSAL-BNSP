import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.VITE_NEON_DB_URL;
if (!dbUrl) throw new Error("No URL");

const sql = neon(dbUrl);

async function main() {
  const resB = await sql`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'bookings';
  `;
  console.log("bookings:", resB.map(r => r.column_name));

  const resU = await sql`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'users';
  `;
  console.log("users:", resU.map(r => r.column_name));
}
main();
