# Dokumen 5: Laporan Debugging Sistem Reservasi

**Mata Uji Kompetensi:** J.620100.025.02 Melakukan Debugging
**Proyek:** Sistem Reservasi Lapangan Olahraga SM Sport Center

---

## 1. Latar Belakang Kasus (Error)
Pada tahap awal pengembangan dan uji coba, ditemukan celah kelemahan (*bug*) kritis.
- **Kasus:** Reservasi tetap tersimpan ke dalam *database* meskipun pada jam tersebut dan di lapangan tersebut sudah ada pesanan (*Double Booking*).
- **Contoh Kejadian:** Pengguna A memesan Lapangan Futsal 1 pukul 09:00 - 11:00. Kemudian Pengguna B memesan Lapangan Futsal 1 pukul 10:00 - 12:00. Sistem menerima pemesanan Pengguna B karena *query database* sebelumnya belum memiliki fungsi mendeteksi "irisan waktu". Hal ini mengakibatkan kerugian dan keributan pada pihak pelanggan di lapangan.

## 2. Penyebab Masalah (*Root Cause*)
Kurangnya validasi algoritma perbandingan *datetime* di tingkat aplikasi dan *database*. Sistem sebelumnya hanya menyimpan nilai murni tanpa membandingkan rentang waktu secara silang (*overlap detection*). 

## 3. Solusi Perbaikan (*Fix*)
Melakukan _debugging_ pada lapisan *Controller* yang mengatur manipulasi basis data (*Data Manipulation Language*).
Kami mengimplementasikan **Algoritma Deteksi Irisan Rentang Waktu (Time Overlap Algorithm)**.

Rumus logika dasar dari *overlap* adalah: 
`(Mulai_Baru < Selesai_Lama) AND (Selesai_Baru > Mulai_Lama)`

**Kode Perbaikan (Fix) di `src/lib/db.ts`:**
```typescript
export async function cekKetersediaanDB(lapanganId: number, tanggal: string, jamMulai: string, jamSelesai: string) {
  // Query ini mendeteksi apakah ada rentang jam yang beririsan
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
```

Modul pendaftaran jadwal (`buatReservasiDB`) kemudian di-_refactor_ untuk **WAJIB memanggil** fungsi `cekKetersediaanDB` ini di baris pertama eksekusi:

```typescript
export async function buatReservasiDB(...) {
  const bentrok = await cekKetersediaanDB(lapanganId, tanggal, jamMulai, jamSelesai);
  if (bentrok) {
    throw new Error('Jadwal bentrok dengan reservasi lain!'); // Blokir eksekusi!
  }
  
  // Jika aman, lanjutkan proses INSERT ke tabel...
}
```

## 4. Hasil Perbaikan
Setelah algoritma tersebut diterapkan, ketika Pengguna B menekan tombol "Konfirmasi Reservasi" pada jam yang beririsan (10:00 - 12:00), maka sistem merespons dengan melempar blok *Error* berwarna merah: **"Jadwal bentrok dengan reservasi lain!"** dan mencegah pesanan terekam ke *database*. Insiden jadwal ganda berhasil dihilangkan secara penuh.
