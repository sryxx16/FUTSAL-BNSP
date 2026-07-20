import { sql } from './src/lib/db';

async function main() {
  console.log("Mulai setup tabel settings...");
  
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(50) PRIMARY KEY,
        value TEXT NOT NULL
      )
    `;
    console.log("Tabel settings berhasil dibuat (atau sudah ada).");

    await sql`
      INSERT INTO settings (key, value) VALUES
      ('contact_address', 'Jl. Olahraga No. 88, Senayan, Jakarta Selatan'),
      ('contact_phone', '+62 812 3456 7890'),
      ('contact_email', 'info@smsport.com')
      ON CONFLICT (key) DO NOTHING
    `;
    console.log("Data awal berhasil dimasukkan.");
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  }
}

main().then(() => process.exit(0));
