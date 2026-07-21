# Dokumen Kode Program

**Sistem Reservasi SM Sport Center**
**Unit Kompetensi:** J.620100.023.02 Membuat Dokumen Kode Program

| Keterangan | Detail |
|---|---|
| **Skema Sertifikasi (KKNI/Okupasi/Klaster)** | Analis Program |
| **Nomor** | SKM-2019-62010-002 |
| **TUK** | Sewaktu/Tempat Kerja/Mandiri** |
| **Nama Asesor** | Irmawati Carolina |
| **Nama Asesi** | Surya Daffa Fauzi Khoerudin |

---

## 1. Penjelasan Modul
Sistem Reservasi SM Sport Center dibangun menggunakan arsitektur modern berbasis Next.js (App Router) dan modul koneksi langsung ke *Serverless* PostgreSQL (Neon). Agar kode program mudah dipelihara (*maintainable*) dan mudah dikembangkan (*scalable*), sistem dibagi ke dalam beberapa modul utama.

### a. Modul Autentikasi dan Manajemen Pengguna (Auth & User Module)
**Lokasi Direktori:** `src/pages/AuthPage.tsx` & `src/lib/db.ts`
**Fungsi Modul:** Menangani proses pendaftaran akun, verifikasi login, serta pengelolaan sesi lokal. Modul ini juga bertugas memisahkan hak akses (*role-based access control*) antara antarmuka Admin dengan Pelanggan biasa, di mana email `admin@smsport.com` akan otomatis diberikan antarmuka khusus Dasbor Admin.

### b. Modul Manajemen Lapangan (Court Management Module)
**Lokasi Direktori:** `src/admin/views/SettingsView.tsx` & `src/lib/db.ts`
**Fungsi Modul:** Bertanggung jawab atas pengelolaan data master fasilitas lapangan (Futsal & Badminton). Melalui modul ini, Admin dapat mengubah harga sewa per jam (*price per hour*) secara dinamis tanpa perlu mengubah baris kode, dan menyimpannya langsung ke dalam *database*.

### c. Modul Reservasi dan Penjadwalan (Booking & Scheduling Module)
**Lokasi Direktori:** `src/components/home/ScheduleSection.tsx` & `src/lib/db.ts`
**Fungsi Modul:** Merupakan modul inti (*core module*) yang menangani alur pemesanan lapangan. Modul ini menampilkan Papan Jadwal (*Live Schedule*) ketersediaan lapangan secara langsung (*real-time*), serta melakukan validasi bentrok jadwal (*overlap validation*) sebelum data reservasi disimpan ke dalam *database*.

### d. Modul Pembayaran dan Konfirmasi (Payment & Confirmation Module)
**Lokasi Direktori:** `src/components/home/BookingModal.tsx` & `src/lib/db.ts`
**Fungsi Modul:** Mengelola transaksi pembayaran DP (Uang Muka) sistem. Modul ini memfasilitasi pelanggan dengan menampilkan kode QR (QRIS Dinamis) dengan nominal bayar sebesar 50% dari total harga. Sistem otomatis mengunci status pesanan menjadi "Sudah DP 50%" setelah proses verifikasi internal.

### e. Modul Otomatisasi & Laporan (Cron Job & Reporting Module)
**Lokasi Direktori:** `src/admin/views/DashboardView.tsx` & `src/lib/db.ts`
**Fungsi Modul:** Menangani fungsi pembatalan otomatis (*auto-cancel*) bagi pesanan berstatus "Menunggu Pembayaran" yang tidak dilunasi DP-nya dalam waktu 20 menit. Modul ini juga bertugas memproses agregasi data hitung cepat (*COUNT, SUM*) untuk Dasbor Admin dan menyediakan fitur Cetak Laporan PDF.

---

## 2. Deskripsi Fungsi

### 1. `cekKetersediaanDB()`
**Modul:** Modul Reservasi (`src/lib/db.ts`)
**Tujuan:** Mencegah terjadinya pemesanan ganda (*double booking*) pada lapangan, tanggal, dan rentang jam yang sama.
**Parameter Input:**
- `courtId` (Integer) - ID Lapangan yang ingin dipesan.
- `tanggal` (Date) - Tanggal penggunaan lapangan.
- `jamMulai` (Time) - Jam mulai bermain.
- `jamSelesai` (Time) - Jam selesai bermain.
**Nilai Kembalian:** Boolean (`true` jika jadwal bentrok/sudah terisi, `false` jika jadwal kosong/tersedia).
**Deskripsi Logika:** Fungsi melakukan kueri ke tabel `bookings` untuk mencari pesanan aktif (status 'Sudah DP 50%' atau 'Menunggu Pembayaran') pada `court_id` dan `date` yang sama, dengan rentang waktu yang saling bertindihan (*overlapping*) dengan jam *input* pelanggan.

### 2. `createReservasi()`
**Modul:** Modul Reservasi (`src/lib/db.ts`)
**Tujuan:** Membuat dan menyimpan rekor pesanan baru ke *database* setelah melewati tahap validasi waktu.
**Parameter Input:**
- `pelangganId` (Integer) - ID Pelanggan yang menyewa.
- `lapanganId` (Integer) - ID Lapangan yang dipilih.
- `tanggal` (Date) - Tanggal bermain.
- `jamMulai` (Time) - Jam mulai pemesanan.
- `jamSelesai` (Time) - Jam selesai pemesanan.
- `totalHarga` (Integer) - Total biaya keseluruhan.
**Nilai Kembalian:** Object JSON (`{ success: true, bookingId: number }`) atau pesan *error*.
**Deskripsi Logika:**
1. Memanggil fungsi `cekKetersediaanDB()`. Jika bernilai `true`, sistem melemparkan pesan error "Jadwal sudah terisi".
2. Menyimpan data ke tabel `bookings` dengan status awal 'Menunggu Pembayaran' dan parameter uang muka (`dp_amount`) di-set 0.

### 3. `autoCancelExpiredBookings()`
**Modul:** Modul Otomatisasi (`src/lib/db.ts`)
**Tujuan:** Membatalkan pesanan yang belum dibayar (*expired*) untuk membebaskan kembali jadwal lapangan yang terkunci.
**Parameter Input:** Tidak ada.
**Nilai Kembalian:** Tidak ada (*Void*).
**Deskripsi Logika:** Fungsi mencari seluruh baris di tabel `bookings` dengan syarat `status == 'Menunggu Pembayaran'` DAN selisih waktu `created_at` lebih dari 20 Menit dari Waktu Sekarang. Sistem lalu melakukan eksekusi *bulk update* untuk mengubah statusnya menjadi 'Dibatalkan'. Fungsi ini di-*trigger* secara dinamis (*pseudo-cron*) setiap kali ada penarikan data jadwal terbaru.

### 4. `konfirmasiPembayaran()`
**Modul:** Modul Pembayaran (`src/lib/db.ts`)
**Tujuan:** Memproses penyelesaian transaksi pembayaran QRIS (DP 50%) dari pelanggan.
**Parameter Input:**
- `bookingId` (Integer) - ID Pesanan yang akan dibayar DP-nya.
- `dpAmount` (Integer) - Nominal uang muka yang disetorkan.
**Nilai Kembalian:** Boolean (`true` jika eksekusi database berhasil).
**Deskripsi Logika:** Sistem melakukan eksekusi kueri `UPDATE` pada tabel `bookings`. Kolom `dp_amount` diisi dengan nominal uang muka, lalu atribut `status` diubah secara mutlak dari 'Menunggu Pembayaran' menjadi 'Sudah DP 50%'.

### 5. `getStatistikDashboard()`
**Modul:** Modul Laporan (`src/lib/db.ts`)
**Tujuan:** Mengumpulkan dan mengagregasi perhitungan total secara *real-time* untuk disajikan pada halaman Dasbor Admin.
**Parameter Input:** Tidak ada.
**Nilai Kembalian:** Object agregasi statistik (total pendapatan Harian, Bulanan, dan daftar lapangan terpopuler).
**Deskripsi Logika:** Fungsi mengeksekusi kueri agregasi `SUM(total_price)` dengan filter tanggal berjalan (`CURRENT_DATE`) untuk omzet harian, dan melakukan kalkulasi rentang bulan untuk omzet bulanan. Seluruh proses matematika dihitung langsung oleh *database engine* untuk meringankan beban server aplikasi.

---

## 3. Struktur Database

### 1. Tabel Users (Pelanggan)
| Nama Atribut | Tipe Data | Batasan (Constraint) | Keterangan |
|---|---|---|---|
| `id` | SERIAL (INT) | Primary Key (PK) | Kode unik identitas otomatis untuk setiap pengguna. |
| `name` | VARCHAR(100) | NOT NULL | Nama lengkap pengguna. |
| `email` | VARCHAR(100) | UNIQUE, NOT NULL | Alamat surel unik untuk autentikasi login dan komunikasi. |
| `phone` | VARCHAR(20) | DEFAULT '' | Nomor telepon atau kontak WhatsApp pengguna. |
| `password` | VARCHAR(255) | NOT NULL | Kata sandi akun yang telah diamankan (ter-hash). |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Catatan waktu otomatis saat akun pertama kali didaftarkan. |

### 2. Tabel Court (Lapangan Olahraga)
| Nama Atribut | Tipe Data | Batasan (Constraint) | Keterangan |
|---|---|---|---|
| `id` | SERIAL (INT) | Primary Key (PK) | Kode unik identitas otomatis untuk data lapangan. |
| `name` | VARCHAR(100) | NOT NULL | Nama identitas lapangan (misal: Futsal A, Badminton 1). |
| `type` | VARCHAR(50) | NOT NULL | Jenis cabang olahraga lapangan (Futsal / Badminton). |
| `price_per_hour` | DECIMAL(10,2) | NOT NULL | Nominal tarif sewa lapangan per jam. |

### 3. Tabel Bookings (Transaksi Reservasi)
| Nama Atribut | Tipe Data | Batasan (Constraint) | Keterangan |
|---|---|---|---|
| `id` | SERIAL (INT) | Primary Key (PK) | Kode unik nomor transaksi reservasi otomatis. |
| `user_id` | INTEGER | Foreign Key (FK) REFERENCES users(id) ON DELETE CASCADE | Relasi ke tabel pengguna yang melakukan penyewaan. |
| `court_id` | INTEGER | Foreign Key (FK) REFERENCES court(id) ON DELETE CASCADE | Relasi ke tabel lapangan yang dipilih untuk dipesan. |
| `date` | DATE | NOT NULL | Tanggal jadwal pelaksanaan reservasi lapangan. |
| `start_time` | TIME | NOT NULL | Jam operasional dimulainya penyewaan lapangan. |
| `end_time` | TIME | NOT NULL | Jam operasional selesainya penyewaan lapangan. |
| `status` | VARCHAR(50) | NOT NULL, DEFAULT 'Menunggu Pembayaran' | Status transaksi (Menunggu Pembayaran / Sudah DP 50% / Selesai / Dibatalkan). |
| `dp_amount` | DECIMAL(10,2) | DEFAULT 0 | Nominal uang muka yang dibayarkan (Opsi DP 50%). |
| `total_price` | DECIMAL(10,2) | DEFAULT 0 | Total kalkulasi biaya sewa yang harus dilunasi pelanggan. |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Catatan waktu saat pesanan pertama kali dibuat di sistem. |
