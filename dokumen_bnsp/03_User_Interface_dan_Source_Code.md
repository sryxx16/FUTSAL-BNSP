# Dokumen 3: User Interface dan Source Code

**Mata Uji Kompetensi:** 
- J.620100.022.02 Mengimplementasikan Algoritma Pemrograman
**Proyek:** Sistem Reservasi Lapangan Olahraga SM Sport Center

---

## 1. Tampilan User Interface (Screenshot)

*(Catatan untuk Surya: Silakan hapus teks miring di bawah ini dan _paste_ tangkapan layar/screenshot layar web Anda untuk masing-masing halaman)*

### A. Halaman Beranda (Landing Page)
*(Tempatkan screenshot halaman beranda utama di sini. Menampilkan informasi fasilitas, daftar lapangan futsal & badminton, beserta tombol reservasi).*

### B. Halaman Autentikasi (Form Login & Register)
*(Tempatkan screenshot halaman /login di sini. Memperlihatkan form tempat pelanggan memasukkan email dan password).*

### C. Halaman Reservasi Lapangan
*(Tempatkan screenshot halaman /book di sini. Memperlihatkan form dropdown pilih lapangan, kolom nama yang otomatis terisi jika sudah login, input kalender tanggal, serta pilihan jam mulai dan jam selesai).*

### D. Halaman Dasbor Admin (CRUD)
*(Tempatkan screenshot Dasbor Admin `/admin` di sini. Memperlihatkan statistik total reservasi, serta tabel yang memuat seluruh transaksi pemesanan).*

### E. Halaman Riwayat Pemesanan (My Bookings)
*(Tempatkan screenshot `/my-bookings` di sini. Memperlihatkan riwayat transaksi untuk pengguna yang sedang login).*

---

## 2. Implementasi Source Code Utama (Tautan)

Seluruh struktur _source code_ dibangun menggunakan arsitektur komponen React (Vite) dipadukan dengan TypeScript. 
Untuk memenuhi bukti fisik pengujian, *source code* secara lengkap diunggah ke dalam *repository* *Version Control System* (GitHub).

**Tautan Repository Kode Sumber:** 
👉 `https://github.com/sryxx16/FUTSAL-BNSP`

### Logika Kunci: Algoritma Pencarian Jadwal Bentrok
Algoritma utama yang diimplementasikan pada lapisan antarmuka (mencegah form terkirim) serta lapisan _database_ berada di `src/lib/db.ts`:

```typescript
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
```
*Algoritma di atas membandingkan dua interval waktu dengan mencari irisan dari jam pemesanan yang diajukan dengan jadwal yang sudah ada.*
