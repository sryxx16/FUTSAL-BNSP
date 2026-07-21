# Studi Kasus Analis Program - Sistem Reservasi Lapangan SM Sport Center

**Sistem Reservasi SM Sport Center**
**Unit Kompetensi:** J.620100.002.01 - Menganalisis Skalabilitas Perangkat Lunak

| Keterangan | Detail |
|---|---|
| **Skema Sertifikasi (KKNI/Okupasi/Klaster)** | Analis Program |
| **Nomor** | SKM-2019-62010-002 |
| **TUK** | Sewaktu/Tempat Kerja/Mandiri** |
| **Nama Asesor** | Irmawati Carolina |
| **Nama Asesi** | Surya Daffa Fauzi Khoerudin |

### PERMASALAHAN
SM Sport Center memiliki 2 lapangan futsal dan 3 lapangan badminton. Saat ini proses reservasi masih dilakukan melalui telepon dan WhatsApp sehingga sering terjadi:
a. Jadwal bentrok (*double booking*)
b. Kesalahan pencatatan transaksi
c. Sulit membuat laporan penggunaan lapangan
d. Sulit mengetahui lapangan yang masih tersedia 
Manajemen menginginkan sistem reservasi SM Sport Center berbasis web yang dapat digunakan pelanggan dan admin.

<br>

**Program Studi Teknologi Informasi Fakultas Teknik dan Informatika Universitas Bina Sarana Informatika**
**Jakarta**
**2026**

---

## 1. Analisis Kebutuhan Dan Identifikasi Aktor

### 1.1. Identifikasi Aktor

| Aktor | Deskripsi Peran | Hak Akses Sistem |
|---|---|---|
| **Admin** | Pengelola internal SM Sport Center yang bertanggung jawab atas manajemen operasional lapangan. | Melakukan login, memantau semua riwayat reservasi, melakukan pencarian dan penyaringan data, membatalkan transaksi, mengelola pengaturan tarif, serta mengunduh laporan pendapatan. |
| **Customer** | Anggota masyarakat atau pelanggan umum yang ingin menyewa fasilitas lapangan olahraga. | Melakukan pendaftaran akun baru, login, memeriksa jadwal ketersediaan lapangan secara real-time, serta membuat dan membatalkan reservasi miliknya sendiri. |

### 1.2. Daftar Interaksi

*(Bagian ini dikosongkan / diisi diagram interaksi)*

### 1.3. Kebutuhan Fungsional

| No | Kebutuhan Fungsional |
|---|---|
| 1 | Sistem harus mengadopsi arsitektur Next.js App Router dengan React Server Components (RSC) untuk mempercepat muat awal halaman secara signifikan. |
| 2 | Sistem harus memungkinkan pelanggan memilih tanggal, jam mulai, dan jam selesai secara fleksibel. |
| 3 | Sistem secara proaktif menolak masukan jadwal jika terjadi irisan waktu (time overlap) pada lapangan dan tanggal yang sama. |
| 4 | Sistem harus menampilkan seluruh daftar reservasi dalam sebuah Dasbor Utama untuk Admin. |
| 5 | Sistem harus mengizinkan admin untuk mengubah status pesanan menjadi Selesai atau Dibatalkan serta menghapus data transaksi (CRUD). |
| 6 | Sistem harus menyediakan panel pengaturan dinamis bagi Admin untuk memperbarui harga sewa lapangan pada sistem. |
| 7 | Sistem harus menerapkan indeks database (CREATE INDEX) pada kolom foreign key dan pencarian untuk mencegah Full Table Scan. |
| 8 | Sistem harus menyediakan fitur pembayaran DP 50% di awal melalui QRIS Dinamis untuk mengunci jadwal sewa. |
| 9 | Sistem harus menjalankan fungsi pembatalan otomatis (Auto-Cancel) jika pesanan didiamkan selama lebih dari 20 menit tanpa pelunasan DP. |

### 1.4. Kebutuhan Non Fungsional

| No | Kategori | Kebutuhan |
|---|---|---|
| 1 | **Performance** | Waktu respons (response time) untuk mengecek ketersediaan jadwal lapangan wajib berada di bawah 1 detik agar pelanggan tidak merasa lag. |
| 2 | **Availability** | Sistem harus di-deploy di atas layanan cloud Vercel yang mampu menjamin tingkat stabilitas uptime minimal sebesar 99.9%. |
| 3 | **Reliability** | Sistem harus tangguh dan efisien dengan ukuran basis data yang diestimasikan tetap berada di bawah 5 MB dalam kurun waktu 5 tahun operasional. |
| 4 | **Security** | Seluruh jalur komunikasi data harus diamankan menggunakan enkripsi SSL (HTTPS) dan hak akses diatur via Role-Based Access Control (RBAC). |
| 5 | **Scalability** | Sistem harus didukung arsitektur lanjutan seperti PgBouncer / Neon Pooler dan Caching Layer (Redis) untuk menangani lonjakan koneksi serentak di masa depan. |
| 6 | **Maintainability** | Sistem harus menerapkan Server-side Pagination dengan batasan klausa LIMIT dan OFFSET pada Dasbor Admin agar struktur data mudah dikelola. |
| 7 | **Security (API)** | Endpoint API pada sistem harus dilengkapi dengan fitur Rate Limiting untuk mencegah aktivitas spam atau percobaan booking palsu dari program bot. |
| 8 | **Audit** | Sistem harus mencatat setiap riwayat perubahan data krusial (seperti perubahan harga sewa oleh admin atau penghapusan transaksi) ke dalam log aktivitas database untuk kebutuhan audit berkala. |

---

## 2. Analisis Skalabilitas Perangkat Lunak

### 2.1. Identifikasi Potensi Hambatan (Bottleneck)

| No | Titik Hambatan | Penyebab Masalah | Dampak Pada Sistem | Solusi Teknis Terpilih |
|---|---|---|---|---|
| 1 | **Tampilan Dasbor & Statistik** | Perhitungan total pendapatan dan jumlah pesanan dilakukan dengan menarik semua data terlebih dahulu ke server aplikasi, bukan dihitung langsung oleh mesin database. | Halaman dasbor Admin akan memuat sangat lambat seiring bertambahnya jumlah riwayat pesanan. | Mengubah metode perhitungan dengan memanfaatkan fungsi agregasi bawaan database (seperti COUNT dan SUM) sehingga server hanya menerima hasil akhir. |
| 2 | **Unduh Data Laporan** | Sistem mengunduh seluruh data dalam satu rentang waktu secara sekaligus ke dalam memori server tanpa pembatasan. | Jika data ditarik untuk laporan tahunan yang masif, server bisa kehabisan memori dan mengalami timeout (gagal muat). | Menerapkan metode unduh bertahap (Data Streaming/Chunking) untuk membaca dan mengunduh data secara dicicil per halaman. |
| 3 | **Pembatalan Otomatis 20 Menit** | Metode penjadwalan sistem di latar belakang untuk membatalkan pesanan belum terpusat secara konsisten pada arsitektur serverless. | Fitur auto-cancel berisiko tidak berjalan tepat waktu jika sistem diunggah ke server cloud modern yang bersifat stateless. | Menggunakan layanan cron-job eksternal terintegrasi yang disediakan oleh platform server cloud untuk menjamin akurasi waktu eksekusi. |
| 4 | **Pencarian Data Kedaluwarsa** | Database mencari pesanan yang belum dibayar dengan mengecek keseluruhan data satu per satu (Full Table Scan) tanpa ada penanda khusus. | Proses pencarian menjadi sangat berat dan memperlambat respons sistem saat jumlah transaksi sudah mencapai puluhan ribu baris. | Membuat indeks gabungan (Composite Index) pada kolom Status dan Waktu Dibuat di dalam database agar pencarian selesai dalam hitungan milidetik. |
| 5 | **Sistem Pembayaran** | Proses pembayaran QRIS saat ini masih bersifat simulasi internal dan belum terhubung dengan penyedia pihak ketiga (Payment Gateway). | Rentan terhadap manipulasi status transaksi dan memerlukan penyesuaian keamanan berlapis saat diintegrasikan ke sistem nyata. | Menggunakan arsitektur pengamanan transaksi berbasis Idempotency Key dan webhook resmi dari Payment Gateway penyedia QRIS. |

### 2.2. Estimasi Pertumbuhan Data Reservasi

Asumsi Perhitungan: Terdapat 5 lapangan fisik (2 Futsal, 3 Badminton) dengan waktu operasional 12 jam bulanan. Total kapasitas maksimal adalah 60 slot jam per hari. Diterapkan asumsi tingkat keterisian awal rata-rata sebesar 70% (sekitar 42 pesanan/hari) dengan target proyeksi pertumbuhan bisnis sebesar 15% setiap tahunnya.

| Tahun | Rata-rata Pesanan per Hari | Estimasi Pesanan per Tahun | Total Akumulasi Data Terkumpul | Dampak pada Storage (Neon PostgreSQL) |
|---|---|---|---|---|
| 1 | 42 pesanan | ± 15.120 baris data | 15.120 baris data | Beban penyimpanan sangat kecil, komputasi pembacaan data normal. |
| 2 | 48 pesanan | ± 17.388 baris data | 32.508 baris data | Skala Kecil, kueri harian masih berjalan di bawah 1 detik. |
| 3 | 55 pesanan | ± 19.996 baris data | 52.504 baris data | Skala Menengah, performa stabil berkat adanya indeks database. |
| 4 | 63 pesanan | ± 22.995 baris data | 75.499 baris data | Diperlukan optimasi kueri dasbor admin agar browser tidak freeze. |
| 5 | 73 pesanan | ± 26.444 baris data | 101.943 baris data | Ukuran total data tetap di bawah 10 MB, kapasitas penyimpanan sangat aman. |

### 2.3. Rekomendasi Peningkatan Performa

| No | Area Sistem | Rekomendasi Perbaikan Skalabilitas | Alasan & Manfaat Teknis |
|---|---|---|---|
| 1 | **Dasbor & Statistik** | Optimasi kueri kalkulasi dengan memindahkan beban hitung dari server aplikasi langsung ke level database. | Mengurangi beban RAM server aplikasi secara signifikan dan mempercepat pemuatan halaman utama admin. |
| 2 | **Ekspor Laporan** | Implementasi metode baca data secara dicicil (Stream Pagination) untuk pembuatan dokumen format CSV atau Excel. | Menghindari crash atau error akibat kehabisan memori runtime (Out of Memory) pada server Vercel. |
| 3 | **Penjadwalan Otomatis** | Memanfaatkan arsitektur berbasis Event-Driven atau Cloud Scheduler pihak ketiga untuk memicu fungsi auto-cancel. | Menjamin skrip pembatalan otomatis 20 menit berjalan konsisten tanpa bergantung pada status aktif aplikasi. |
| 4 | **Peningkatan Database** | Pemberian composite index tambahan pada kolom-kolom yang menjadi parameter filter pencarian data. | Mempercepat waktu respons eksekusi kueri berskala besar agar tetap berada di bawah target 1 detik. |
| 5 | **Migrasi Gateway Pembayaran** | Penerapan arsitektur pengamanan transaksi berbasis Idempotency Key saat integrasi ke API QRIS komersial. | Mencegah terjadinya kesalahan fatal berupa double-payment atau pembayaran ganda untuk satu ID reservasi yang sama. |
| 6 | **Pengarsipan Data** | Membuat kebijakan pembersihan otomatis dan pemindahan data riwayat transaksi lama (di atas 2 tahun) ke cold storage. | Menjaga ukuran tabel utama database operasional (Neon PostgreSQL) tetap ringkas dan responsif jangka panjang. |
