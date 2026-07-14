import { neon } from '@neondatabase/serverless';

const dbUrl = import.meta.env.VITE_NEON_DB_URL;

if (!dbUrl) {
  throw new Error("VITE_NEON_DB_URL belum dikonfigurasi di file .env");
}

const sql = neon(dbUrl);

export async function getDaftarLapangan() {
  const result = await sql`SELECT * FROM lapangan ORDER BY id ASC`;
  return result;
}

export async function getSemuaReservasi() {
  const result = await sql`
    SELECT 
      r.id, 
      p.nama as pelanggan_nama, 
      l.nama as lapangan_nama, 
      r.tanggal, 
      r.jam_mulai, 
      r.jam_selesai, 
      r.status, 
      l.harga_per_jam
    FROM reservasi r
    JOIN pelanggan p ON r.pelanggan_id = p.id
    JOIN lapangan l ON r.lapangan_id = l.id
    ORDER BY r.tanggal DESC, r.jam_mulai DESC
  `;
  return result;
}

export async function cekKetersediaanDB(lapanganId: number, tanggal: string, jamMulai: string, jamSelesai: string) {
  const bentrok = await sql`
    SELECT id FROM reservasi 
    WHERE lapangan_id = ${lapanganId} 
    AND tanggal = ${tanggal}::date
    AND status != 'Dibatalkan'
    AND (
      (jam_mulai < ${jamSelesai}::time AND jam_selesai > ${jamMulai}::time)
    )
  `;
  
  return bentrok.length > 0;
}

export async function buatReservasiDB(pelangganNama: string, lapanganId: number, tanggal: string, jamMulai: string, jamSelesai: string) {
  const bentrok = await cekKetersediaanDB(lapanganId, tanggal, jamMulai, jamSelesai);
  if (bentrok) {
    throw new Error('Jadwal bentrok dengan reservasi lain!');
  }
  
  // Cari apakah user dengan nama tersebut sudah ada
  const existingUser = await sql`SELECT id FROM pelanggan WHERE nama = ${pelangganNama} LIMIT 1`;
  let pelangganId;
  
  if (existingUser.length > 0) {
    pelangganId = existingUser[0].id;
  } else {
    // Buat akun guest secara on-the-fly
    const emailGuest = pelangganNama.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random()*10000) + '@guest.com';
    const newUser = await sql`
      INSERT INTO pelanggan (nama, email, password) 
      VALUES (${pelangganNama}, ${emailGuest}, 'guestpass')
      RETURNING id
    `;
    pelangganId = newUser[0].id;
  }
  
  const result = await sql`
    INSERT INTO reservasi (pelanggan_id, lapangan_id, tanggal, jam_mulai, jam_selesai, status)
    VALUES (${pelangganId}, ${lapanganId}, ${tanggal}::date, ${jamMulai}::time, ${jamSelesai}::time, 'Menunggu')
    RETURNING *
  `;
  
  return result[0];
}
