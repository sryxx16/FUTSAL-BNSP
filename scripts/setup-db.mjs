import { neon } from '@neondatabase/serverless';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
let dbUrl = '';
envFile.split('\n').forEach(line => {
  if (line.startsWith('VITE_NEON_DB_URL=')) {
    dbUrl = line.split('=')[1].replace(/"/g, '').trim();
  }
});

if (!dbUrl) {
  console.error("VITE_NEON_DB_URL not found in .env");
  process.exit(1);
}

const sql = neon(dbUrl);

async function setup() {
  try {
    console.log("Menyiapkan tabel database...");
    
    await sql`
      CREATE TABLE IF NOT EXISTS pelanggan (
          id SERIAL PRIMARY KEY,
          nama VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS lapangan (
          id SERIAL PRIMARY KEY,
          nama VARCHAR(100) NOT NULL,
          tipe VARCHAR(50) NOT NULL,
          harga_per_jam INTEGER NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS reservasi (
          id SERIAL PRIMARY KEY,
          pelanggan_id INTEGER REFERENCES pelanggan(id),
          lapangan_id INTEGER REFERENCES lapangan(id),
          tanggal DATE NOT NULL,
          jam_mulai TIME NOT NULL,
          jam_selesai TIME NOT NULL,
          status VARCHAR(50) DEFAULT 'Menunggu',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Check if lapangan is empty before seeding
    const l = await sql`SELECT count(*) FROM lapangan`;
    if (l[0].count === '0') {
        await sql`
          INSERT INTO lapangan (nama, tipe, harga_per_jam) VALUES
          ('Futsal Court A', 'Futsal', 150000),
          ('Futsal Court B', 'Futsal', 120000),
          ('Badminton 1', 'Badminton', 50000),
          ('Badminton 2', 'Badminton', 50000)
        `;
    }
    
    // Check if pelanggan is empty before seeding
    const p = await sql`SELECT count(*) FROM pelanggan`;
    if (p[0].count === '0') {
        await sql`
          INSERT INTO pelanggan (nama, email, password) VALUES
          ('Budi Santoso', 'budi@example.com', 'password123')
        `;
    }

    console.log("Setup Database berhasil!");
  } catch (error) {
    console.error("Setup gagal:", error);
  }
}

setup();
