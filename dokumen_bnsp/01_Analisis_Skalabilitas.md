# Dokumen 1: Analisis Skalabilitas Perangkat Lunak

**Mata Uji Kompetensi:** J.620100.002.01 Menganalisis Skalabilitas Perangkat Lunak
**Proyek:** Sistem Reservasi Lapangan Olahraga SM Sport Center

---

## 1. Analisis Kebutuhan dan Identifikasi Aktor

### A. Identifikasi Aktor
Berdasarkan proses bisnis pada SM Sport Center, terdapat dua aktor utama yang berinteraksi dengan sistem:
1. **Pelanggan / Member (User):** Pihak yang menyewa lapangan. Mereka memerlukan antarmuka untuk melihat jadwal kosong, melakukan pemesanan (reservasi), dan melihat riwayat pemesanan mereka sendiri.
2. **Administrator (Admin):** Pihak manajemen SM Sport Center. Bertanggung jawab mengelola data master (harga lapangan), mengawasi seluruh transaksi reservasi, dan memvalidasi atau membatalkan pesanan.

### B. Kebutuhan Fungsional (Functional Requirements)
1. **Sistem Autentikasi:** Sistem harus menyediakan fitur pendaftaran (Register) dan masuk (Login) untuk membedakan hak akses antara Pelanggan dan Admin.
2. **Manajemen Reservasi (Pelanggan):** Sistem harus memungkinkan pelanggan memilih tanggal, jam mulai, dan jam selesai, serta memastikan jadwal tersebut belum di-_booking_ oleh orang lain.
3. **Manajemen Reservasi (Admin):** Sistem harus menampilkan seluruh daftar reservasi dalam sebuah Dasbor dan mengizinkan admin untuk mengubah status pesanan (Selesai/Dibatalkan) serta menghapus pesanan (CRUD).
4. **Validasi Anti-Bentrok:** Sistem secara proaktif menolak masukan jadwal jika terjadi irisan waktu (_time overlap_) pada lapangan dan tanggal yang sama.

### C. Kebutuhan Non-Fungsional (Non-Functional Requirements)
1. **Performa:** Waktu respons (_response time_) untuk mengecek ketersediaan jadwal harus di bawah 1 detik agar pelanggan tidak merasa *lag*.
2. **Ketersediaan (Availability):** Sistem di-_deploy_ di atas layanan *cloud* (Vercel) yang menjamin *uptime* 99.9%.
3. **Keamanan:** Komunikasi data diamankan melalui enkripsi SSL (HTTPS) dan kredensial akses diatur melalui *Role-Based Access Control* (RBAC).

---

## 2. Analisis Skalabilitas Sistem

Sistem reservasi yang bersifat _real-time_ menghadapi tantangan ketika jumlah pengguna (*traffic*) meningkat secara drastis, terutama pada jam-jam *prime time* (sore - malam hari).

### A. Potensi Bottleneck
*Bottleneck* (penyempitan performa) yang paling potensial terjadi pada proses eksekusi **Query Pengecekan Ketersediaan Jadwal**. 
Ketika 100 orang secara bersamaan menekan tombol "Booking" pada tanggal yang sama, _database_ harus melakukan perhitungan matematika (_overlap detection_) pada rentang waktu `jam_mulai` dan `jam_selesai`. Jika tabel reservasi sudah berisi ratusan ribu baris, _Full Table Scan_ akan terjadi dan mengakibatkan antrean proses di CPU _Database_.

### B. Estimasi Pertumbuhan Data
SM Sport Center memiliki **2 lapangan futsal dan 3 lapangan badminton** (Total 5 lapangan).
Asumsi operasional: 
- 1 Lapangan melayani maksimal 10 sesi/hari.
- Total maksimal per hari = 5 lapangan x 10 sesi = 50 reservasi/hari.
- Perkiraan dalam 1 Bulan = 1.500 baris data reservasi.
- **Perkiraan Pertumbuhan Data 1 Tahun = 18.250 baris data / tahun.**

Berdasarkan arsitektur *Cloud Serverless PostgreSQL* (Neon), menangani 18.250 baris/tahun adalah beban kerja yang sangat ringan (Skala Kecil-Menengah). Skalabilitas *storage* tidak menjadi masalah utama, melainkan skalabilitas kalkulasi *Read-Query*.

### C. Rekomendasi Peningkatan Performa
Untuk memastikan sistem tetap *scalable* saat jumlah pesanan mencapai puluhan ribu, kami merekomendasikan:
1. **Penerapan Database Indexing:** 
   Membuat kombinasi *index* (_Composite Index_) pada kolom `(lapangan_id, tanggal)` di tabel `reservasi`. Hal ini akan mencegah _Full Table Scan_ karena *database* dapat langsung melompat ke blok data spesifik lapangan dan hari tertentu saat memvalidasi bentrok jadwal.
2. **Pendekatan Connection Pooling:** 
   Karena aplikasi menggunakan fungsi berbasis *serverless* (Edge/Serverless Functions Vercel), maka wajib menerapkan mekanisme koneksi *Pooling* (misalnya pgbouncer) atau *HTTP-based pooling* seperti yang disediakan oleh arsitektur Neon, agar *database* tidak tumbang (_connection limit reached_) saat diakses ribuan klien serentak.
3. **Cron Job & Polling Terdistribusi (Auto-Cancel & Notifikasi):**
   Fitur Auto-Cancel 20 Menit dan Polling Notifikasi 30 Detik memicu kueri yang sangat intens. Dengan menggunakan arsitektur serverless, fungsi-fungsi ini diisolasi per request sehingga meminimalisir beban *CPU blocking* di sisi server utama.
