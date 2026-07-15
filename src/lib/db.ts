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

export async function getStatistikDashboard() {
  const rsToday = await sql`SELECT count(*) as total FROM reservasi WHERE tanggal = CURRENT_DATE`;
  const rsRevenue = await sql`
    SELECT COALESCE(SUM(l.harga_per_jam), 0) as total 
    FROM reservasi r 
    JOIN lapangan l ON r.lapangan_id = l.id 
    WHERE r.status != 'Dibatalkan' AND EXTRACT(MONTH FROM r.tanggal) = EXTRACT(MONTH FROM CURRENT_DATE)
  `;
  const rsUsers = await sql`SELECT count(*) as total FROM pelanggan`;
  
  return {
    reservasiHariIni: rsToday[0].total,
    pendapatanBulanan: rsRevenue[0].total,
    memberAktif: rsUsers[0].total
  };
}

export async function hapusReservasi(id: number) {
  return await sql`DELETE FROM reservasi WHERE id = ${id}`;
}

export async function updateStatusReservasi(id: number, status: string) {
  return await sql`UPDATE reservasi SET status = ${status} WHERE id = ${id}`;
}

export async function getDaftarPelanggan() {
  return await sql`
    SELECT p.id, p.nama, p.email, TO_CHAR(p.created_at, 'DD Mon YYYY') as tgl_daftar, 
           COUNT(r.id) as total_booking
    FROM pelanggan p
    LEFT JOIN reservasi r ON p.id = r.pelanggan_id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `;
}

export async function updateHargaLapangan(id: number, harga: number) {
  return await sql`UPDATE lapangan SET harga_per_jam = ${harga} WHERE id = ${id}`;
}

// === AUTH & USERS === //

export async function loginUser(email: string, password: string) {
  const result = await sql`SELECT id, nama, email FROM pelanggan WHERE email = ${email} AND password = ${password}`;
  if (result.length > 0) {
    const user = result[0];
    // Define admin based on specific email
    const isAdmin = user.email === 'admin@smsport.com' || user.email === 'admin@futsal.com';
    return { ...user, role: isAdmin ? 'admin' : 'user' };
  }
  throw new Error("Email atau password salah.");
}

export async function registerUser(nama: string, email: string, password: string) {
  const check = await sql`SELECT id FROM pelanggan WHERE email = ${email}`;
  if (check.length > 0) throw new Error("Email sudah terdaftar.");
  
  const result = await sql`
    INSERT INTO pelanggan (nama, email, password) 
    VALUES (${nama}, ${email}, ${password})
    RETURNING id, nama, email
  `;
  const user = result[0];
  const isAdmin = user.email === 'admin@smsport.com' || user.email === 'admin@futsal.com';
  return { ...user, role: isAdmin ? 'admin' : 'user' };
}

export async function getRiwayatBooking(pelangganId: number) {
  return await sql`
    SELECT r.id, l.nama as lapangan_nama, r.tanggal, r.jam_mulai, r.jam_selesai, r.status, l.harga_per_jam
    FROM reservasi r
    JOIN lapangan l ON r.lapangan_id = l.id
    WHERE r.pelanggan_id = ${pelangganId}
    ORDER BY r.tanggal DESC, r.jam_mulai DESC
  `;
}
