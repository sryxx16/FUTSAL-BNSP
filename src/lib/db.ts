import { neon } from '@neondatabase/serverless';

const dbUrl = import.meta.env.VITE_NEON_DB_URL;

if (!dbUrl) {
  throw new Error("VITE_NEON_DB_URL belum dikonfigurasi di file .env");
}

const sql = neon(dbUrl);

export async function autoCancelExpiredBookings() {
  await sql`
    UPDATE bookings 
    SET status = 'Dibatalkan' 
    WHERE status = 'Menunggu Pembayaran' 
    AND (created_at + INTERVAL '20 minutes') < CURRENT_TIMESTAMP
  `;
}

export async function getDaftarLapangan() {
  const result = await sql`
    SELECT id, name as nama, type as jenis, price_per_hour as harga_per_jam 
    FROM court ORDER BY id ASC
  `;
  return result;
}

export async function getJadwalHariIni() {
  await autoCancelExpiredBookings();
  const result = await sql`
    SELECT 
      c.id as lapangan_id,
      c.name as lapangan_nama,
      b.start_time as jam_mulai, 
      b.end_time as jam_selesai
    FROM court c
    LEFT JOIN bookings b ON c.id = b.court_id 
      AND b.date = CURRENT_DATE 
      AND b.status != 'Dibatalkan'
    ORDER BY c.id ASC, b.start_time ASC
  `;
  return result;
}

export async function getSemuaReservasi() {
  await autoCancelExpiredBookings();
  const result = await sql`
    SELECT 
      b.id, 
      u.name as pelanggan_nama, 
      c.name as lapangan_nama, 
      b.date as tanggal, 
      b.start_time as jam_mulai, 
      b.end_time as jam_selesai, 
      b.status, 
      c.price_per_hour as harga_per_jam
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN court c ON b.court_id = c.id
    ORDER BY b.date DESC, b.start_time DESC
  `;
  return result;
}

export async function cekKetersediaanDB(lapanganId: number, tanggal: string, jamMulai: string, jamSelesai: string) {
  const bentrok = await sql`
    SELECT id FROM bookings 
    WHERE court_id = ${lapanganId} 
    AND date = ${tanggal}::date
    AND status != 'Dibatalkan'
    AND (
      (start_time < ${jamSelesai}::time AND end_time > ${jamMulai}::time)
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
  const existingUser = await sql`SELECT id FROM users WHERE name = ${pelangganNama} LIMIT 1`;
  let pelangganId;
  
  if (existingUser.length > 0) {
    pelangganId = existingUser[0].id;
  } else {
    // Buat akun guest secara on-the-fly
    const emailGuest = pelangganNama.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random()*10000) + '@guest.com';
    const newUser = await sql`
      INSERT INTO users (name, email, password) 
      VALUES (${pelangganNama}, ${emailGuest}, 'guestpass')
      RETURNING id
    `;
    pelangganId = newUser[0].id;
  }
  
  const courtInfo = await sql`SELECT price_per_hour FROM court WHERE id = ${lapanganId}`;
  const pricePerHour = courtInfo[0].price_per_hour;
  
  const result = await sql`
    INSERT INTO bookings (user_id, court_id, date, start_time, end_time, status, total_price)
    VALUES (
      ${pelangganId}, 
      ${lapanganId}, 
      ${tanggal}::date, 
      ${jamMulai}::time, 
      ${jamSelesai}::time, 
      'Menunggu Pembayaran',
      ${pricePerHour} * (EXTRACT(EPOCH FROM (${jamSelesai}::time - ${jamMulai}::time)) / 3600)
    )
    RETURNING id, user_id as pelanggan_id, court_id as lapangan_id, date as tanggal, start_time as jam_mulai, end_time as jam_selesai, status, dp_amount as nominal_dp, created_at
  `;
  
  return result[0];
}

export async function getStatistikDashboard() {
  const rsToday = await sql`SELECT count(*) as total FROM bookings WHERE date = CURRENT_DATE`;
  const rsRevenue = await sql`
    SELECT COALESCE(SUM(c.price_per_hour * (EXTRACT(EPOCH FROM (b.end_time - b.start_time)) / 3600)), 0) as total 
    FROM bookings b 
    JOIN court c ON b.court_id = c.id 
    WHERE b.status != 'Dibatalkan' AND EXTRACT(MONTH FROM b.date) = EXTRACT(MONTH FROM CURRENT_DATE)
  `;
  const rsUsers = await sql`SELECT count(*) as total FROM users`;
  
  return {
    reservasiHariIni: rsToday[0].total,
    pendapatanBulanan: rsRevenue[0].total,
    memberAktif: rsUsers[0].total
  };
}

export async function hapusReservasi(id: number) {
  return await sql`DELETE FROM bookings WHERE id = ${id}`;
}

export async function updateStatusReservasi(id: number, status: string) {
  return await sql`UPDATE bookings SET status = ${status} WHERE id = ${id}`;
}

export async function getReservasiById(id: number) {
  const result = await sql`
    SELECT b.id, b.date as tanggal, b.start_time as jam_mulai, b.end_time as jam_selesai, b.status, b.dp_amount as nominal_dp,
           c.name as lapangan_nama, c.price_per_hour as harga_per_jam, 
           u.name as pelanggan_nama 
    FROM bookings b 
    JOIN court c ON b.court_id = c.id 
    JOIN users u ON b.user_id = u.id
    WHERE b.id = ${id}
  `;
  return result[0];
}

export async function bayarDPReservasi(id: number, nominal: number) {
  return await sql`UPDATE bookings SET status = 'Sudah DP 50%', dp_amount = ${nominal} WHERE id = ${id}`;
}

export async function getDaftarPelanggan() {
  return await sql`
    SELECT u.id, u.name as nama, u.email, u.phone as no_hp, TO_CHAR(u.created_at, 'DD Mon YYYY') as tgl_daftar, 
           COUNT(b.id) as total_booking
    FROM users u
    LEFT JOIN bookings b ON u.id = b.user_id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `;
}

export async function updateHargaLapangan(id: number, harga: number) {
  return await sql`UPDATE court SET price_per_hour = ${harga} WHERE id = ${id}`;
}

// === AUTH & USERS === //

export async function loginUser(email: string, password: string) {
  const result = await sql`SELECT id, name as nama, email FROM users WHERE email = ${email} AND password = ${password}`;
  if (result.length > 0) {
    const user = result[0];
    const isAdmin = user.email === 'admin@smsport.com' || user.email === 'admin@futsal.com';
    return { ...user, role: isAdmin ? 'admin' : 'user' };
  }
  throw new Error("Email atau password salah.");
}

export async function registerUser(nama: string, email: string, password: string, noHp: string = '') {
  const check = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (check.length > 0) throw new Error("Email sudah terdaftar.");
  
  const result = await sql`
    INSERT INTO users (name, email, password, phone) 
    VALUES (${nama}, ${email}, ${password}, ${noHp})
    RETURNING id, name as nama, email, phone as no_hp
  `;
  const user = result[0];
  const isAdmin = user.email === 'admin@smsport.com' || user.email === 'admin@futsal.com';
  return { ...user, role: isAdmin ? 'admin' : 'user' };
}

export async function getRiwayatBooking(pelangganId: number) {
  return await sql`
    SELECT b.id, c.name as lapangan_nama, b.date as tanggal, b.start_time as jam_mulai, b.end_time as jam_selesai, b.status, c.price_per_hour as harga_per_jam
    FROM bookings b
    JOIN court c ON b.court_id = c.id
    WHERE b.user_id = ${pelangganId}
    ORDER BY b.date DESC, b.start_time DESC
  `;
}

// === ADMIN CRUD & LAPORAN === //

export async function tambahPelangganAdmin(nama: string, email: string, noHp: string = '') {
  const check = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (check.length > 0) throw new Error("Email sudah terdaftar.");
  
  return await sql`
    INSERT INTO users (name, email, password, phone) 
    VALUES (${nama}, ${email}, 'default123', ${noHp})
    RETURNING id
  `;
}

export async function updatePelanggan(id: number, nama: string, email: string, noHp: string = '') {
  return await sql`UPDATE users SET name = ${nama}, email = ${email}, phone = ${noHp} WHERE id = ${id}`;
}

export async function hapusPelanggan(id: number) {
  return await sql`DELETE FROM users WHERE id = ${id}`;
}

export async function getLaporanPendapatan() {
  const harian = await sql`
    SELECT TO_CHAR(date, 'YYYY-MM-DD') as tgl, 
           COUNT(b.id) as total_booking,
           COALESCE(SUM(c.price_per_hour * (EXTRACT(EPOCH FROM (b.end_time - b.start_time)) / 3600)), 0) as total_pendapatan
    FROM bookings b
    JOIN court c ON b.court_id = c.id
    WHERE b.status != 'Dibatalkan'
    GROUP BY date
    ORDER BY date DESC
    LIMIT 14
  `;
  
  const bulanan = await sql`
    SELECT TO_CHAR(date, 'YYYY-MM') as bln, 
           COUNT(b.id) as total_booking,
           COALESCE(SUM(c.price_per_hour * (EXTRACT(EPOCH FROM (b.end_time - b.start_time)) / 3600)), 0) as total_pendapatan
    FROM bookings b
    JOIN court c ON b.court_id = c.id
    WHERE b.status != 'Dibatalkan'
    GROUP BY TO_CHAR(date, 'YYYY-MM')
    ORDER BY bln DESC
    LIMIT 12
  `;
  
  const lapangan = await sql`
    SELECT c.name as nama_lapangan, 
           COUNT(b.id) as total_booking,
           COALESCE(SUM(c.price_per_hour * (EXTRACT(EPOCH FROM (b.end_time - b.start_time)) / 3600)), 0) as total_pendapatan
    FROM bookings b
    JOIN court c ON b.court_id = c.id
    WHERE b.status != 'Dibatalkan'
    GROUP BY c.name
    ORDER BY total_pendapatan DESC
  `;
  
  return { harian, bulanan, lapangan };
}
