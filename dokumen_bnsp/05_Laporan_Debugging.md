# Laporan Debugging

**Sistem Reservasi SM Sport Center**
**Unit Kompetensi:** J.620100.025.02 Melakukan Debugging

| Keterangan | Detail |
|---|---|
| **Skema Sertifikasi (KKNI/Okupasi/Klaster)** | Analis Program |
| **Nomor** | SKM-2019-62010-002 |
| **TUK** | Sewaktu/Tempat Kerja/Mandiri** |
| **Nama Asesor** | Irmawati Carolina |
| **Nama Asesi** | Surya Daffa Fauzi Khoerudin |

---

## 1. Temuan & Penyebab Masalah
Berdasarkan hasil audit pada kode logika pembuatan reservasi di `src/lib/db.ts`, ditemukan celah kerentanan kritis yang menyebabkan *Double Booking* (Jadwal Bentrok).

Mekanisme lama saat ini berjalan sebagai berikut:
1. Membaca ketersediaan jadwal pada database berdasarkan ID lapangan dan jam mulai.
2. Jika tidak ada yang sama persis, simpan jadwal baru (`INSERT`).

Masalah timbul karena:
- Sistem sebelumnya hanya mengecek kesamaan waktu secara kaku (misalnya jam 10:00 vs 10:00).
- Sistem gagal mengantisipasi **"Irisan Rentang Waktu" (*Time Overlap*)**.
- Jika Pengguna A memesan pukul 09:00 - 11:00, lalu Pengguna B memesan pukul 10:00 - 12:00, transaksi Pengguna B akan lolos karena `start_time`-nya berbeda (10:00 vs 09:00).
- Akibatnya, kedua transaksi tersebut sukses terekam ke dalam *database* pada lapangan yang sama dengan rentang waktu yang saling menabrak, yang dapat memicu keributan antar pelanggan di lokasi.

## 2. Rencana Perbaikan
Untuk mencegah *double-booking* secara menyeluruh, operasi reservasi harus didukung dengan **Algoritma Deteksi Irisan Rentang Waktu (Time Overlap Algorithm)** secara langsung di level *query* PostgreSQL. 

Solusi paling tepat dan elegan tanpa membebani memori internal aplikasi adalah dengan menyisipkan kondisi komparasi silang (algoritma *overlap*) pada klausa `WHERE`. Logika dasarnya adalah: **Sebuah jadwal dinyatakan beririsan jika `(Waktu Mulai Baru < Waktu Selesai Lama) DAN (Waktu Selesai Baru > Waktu Mulai Lama)`.** Jika *query* deteksi ini menemukan minimal 1 baris data yang cocok dengan rumus tersebut, maka sistem harus langsung memblokir dan menolak permintaan eksekusi penulisan jadwal baru ke tabel reservasi.

## 3. Rincian Perubahan Kode (Proposed Code Fix)
File yang diubah: `src/lib/db.ts` (bagian eksekusi reservasi utama).

**Kode Lama (Rentan Bentrok):**
```typescript
export async function buatReservasiDB(lapanganId, tanggal, jamMulai, jamSelesai) {
  // Pengecekan statis (Sangat Rentan terhadap Irisan Waktu)
  const cek = await sql`
    SELECT id FROM bookings WHERE court_id = ${lapanganId} AND date = ${tanggal} AND start_time = ${jamMulai}
  `;
  if (cek.length > 0) throw new Error("Jadwal sudah dipesan.");

  const booking = await sql`INSERT INTO bookings ... RETURNING id`;
  return booking;
}
```

**Kode Baru (Aman & Tahan Bentrok):**
```typescript
// 1. Tambahkan fungsi algoritma irisan waktu silang (Time Overlap) di src/lib/db.ts:
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

// 2. Modifikasi fungsi eksekusi utama:
export async function buatReservasiDB(lapanganId, tanggal, jamMulai, jamSelesai) {
  // WAJIB memanggil fungsi proteksi di baris pertama eksekusi
  const isBentrok = await cekKetersediaanDB(lapanganId, tanggal, jamMulai, jamSelesai);
  
  // Blokir eksekusi mutlak jika terdeteksi adanya irisan rentang waktu
  if (isBentrok) {
    throw new Error("Jadwal bentrok dengan reservasi lain!"); 
  }
  
  // Jika aman, baru lanjutkan proses penulisan ke tabel database
  const booking = await sql`INSERT INTO bookings ... RETURNING id`;
  return booking;
}
```
