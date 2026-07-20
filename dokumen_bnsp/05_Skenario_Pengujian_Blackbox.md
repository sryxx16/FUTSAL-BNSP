# Laporan Skenario Pengujian Sistem (Black-Box Testing)
**Nama Proyek:** Sistem Reservasi Lapangan SM Sport Center  
**Metode Pengujian:** Black-Box Testing (Equivalence Partitioning & Boundary Value Analysis)  
**Tujuan Pengujian:** Memastikan seluruh kebutuhan fungsional (Fungsionalitas Web) berjalan sesuai dengan skenario bisnis tanpa *error*.

---

## 1. Modul Autentikasi (Login & Registrasi)

| ID Test | Skenario Pengujian | Langkah-Langkah | Hasil yang Diharapkan (Expected Result) | Status |
|---|---|---|---|---|
| AUTH-01 | Login dengan kredensial Admin yang benar | 1. Buka `/login` <br> 2. Masukkan Email: `admin@smsport.com` <br> 3. Masukkan Password: `admin123` <br> 4. Klik "Masuk" | Sistem mengenali _role_ Admin dan langsung mengarahkan pengguna ke halaman Dasbor Admin (`/admin`). | [ ] Pass |
| AUTH-02 | Login dengan email yang belum terdaftar | 1. Buka `/login` <br> 2. Masukkan email asal <br> 3. Klik "Masuk" | Muncul pesan _error_ merah: "Email atau password salah." dan tidak bisa masuk. | [ ] Pass |
| AUTH-03 | Registrasi akun baru (Pelanggan) | 1. Klik "Daftar Akun" <br> 2. Isi Nama, Email valid, dan Password <br> 3. Klik "Buat Akun" | Form berpindah ke mode Login dengan pesan hijau "Registrasi berhasil!". Data masuk ke Neon Database. | [ ] Pass |

---

## 2. Modul Informasi Ketersediaan (Landing Page)

| ID Test | Skenario Pengujian | Langkah-Langkah | Hasil yang Diharapkan (Expected Result) | Status |
|---|---|---|---|---|
| LND-01 | Menampilkan jadwal yang tersedia | 1. Buka Halaman Utama (`/`) <br> 2. Gulir ke bagian "Papan Jadwal Live" <br> 3. Ubah Tanggal di Kalender Dropdown | Terlihat 5 kotak nama lapangan beserta jadwal ter-*booking* (merah) yang difilter secara dinamis sesuai tanggal yang dipilih. | [ ] Pass |
| LND-02 | Auto-scroll Navbar ke Hero | 1. Gulir layar ke paling bawah <br> 2. Klik menu "Home" di Navbar | Layar secara perlahan (smooth) bergeser kembali ke bagian paling atas web. | [ ] Pass |

---

## 3. Modul Reservasi & Validasi (Anti Double-Booking)

| ID Test | Skenario Pengujian | Langkah-Langkah | Hasil yang Diharapkan (Expected Result) | Status |
|---|---|---|---|---|
| RES-01 | Melakukan pemesanan jadwal kosong | 1. Login sebagai Pelanggan <br> 2. Buka form Booking <br> 3. Pilih lapangan, hari ini, jam 10:00 - 12:00 <br> 4. Submit | Pemesanan sukses, muncul notifikasi hijau. Data masuk ke _database_ dengan status "Menunggu". | [ ] Pass |
| RES-02 | Validasi Bentrok Jadwal (*Double Booking*) | 1. Buka form Booking <br> 2. Pesan di lapangan dan tanggal yang SAMA dengan RES-01, pada jam 11:00 - 13:00 <br> 3. Submit | Sistem MENOLAK pemesanan. Muncul pesan _error_: "Jadwal bentrok dengan reservasi lain!". | [ ] Pass |
| RES-03 | Validasi Time Travel (Jam Selesai Mundur) | 1. Buka form Booking <br> 2. Set Jam Mulai: 15:00 <br> 3. Set Jam Selesai: 12:00 <br> 4. Submit | Sistem menolak. Muncul pesan _error_: "Waktu mulai harus lebih awal dari waktu selesai". | [ ] Pass |
| RES-04 | Validasi Tanggal Kemarin | 1. Buka form Booking <br> 2. Klik pada kolom Tanggal Main | Kalender bawaan *browser* tidak mengizinkan (*disabled*) pengguna memilih tanggal yang sudah lewat/kemarin. | [ ] Pass |

---

## 4. Modul Riwayat, Pembayaran DP & Tagihan

| ID Test | Skenario Pengujian | Langkah-Langkah | Hasil yang Diharapkan (Expected Result) | Status |
|---|---|---|---|---|
| RIW-01 | Kalkulasi otomatis harga x durasi | 1. Buka halaman "Riwayat Pemesanan" <br> 2. Cek tagihan lapangan Futsal (Base = Rp 150.000) yang disewa selama 2 jam | Kolom Total Biaya otomatis menampilkan angka Rp 300.000. | [ ] Pass |
| RIW-02 | Pembayaran DP via QRIS Dinamis | 1. Buka Riwayat, klik tombol Checkout/Bayar pada reservasi baru <br> 2. Pindai QR Code menggunakan kamera HP <br> 3. Klik "Bayar QRIS Sekarang" | Status pesanan otomatis berubah menjadi "Sudah DP 50%" dengan badge biru. | [ ] Pass |
| RIW-03 | Auto-Cancel Reservasi (Batas Waktu) | 1. Buat reservasi baru <br> 2. Diamkan selama lebih dari 20 menit tanpa membayar DP <br> 3. Refresh halaman | Status reservasi otomatis dibatalkan ("Dibatalkan") oleh sistem untuk membuka kembali slot jam tersebut. | [ ] Pass |
| RIW-04 | Batas Jam Operasional | 1. Buka form booking <br> 2. Coba pilih Jam Mulai sebelum 08:00 atau Jam Selesai setelah 23:00 | Sistem akan menolak karena di luar batas jam operasional yang ditetapkan. | [ ] Pass |

---

## 5. Modul Dasbor Manajemen Admin

| ID Test | Skenario Pengujian | Langkah-Langkah | Hasil yang Diharapkan (Expected Result) | Status |
|---|---|---|---|---|
| ADM-01 | Proteksi URL Admin | 1. Buka *Tab Incognito* (Tanpa login) <br> 2. Ketik URL `/admin` | Sistem menolak akses dan langsung melempar pengguna paksa ke halaman `/login`. | [ ] Pass |
| ADM-02 | Filter data reservasi | 1. Login Admin -> Dasbor -> Reservasi <br> 2. Ubah *dropdown* status menjadi "Selesai" | Tabel secara instan (*real-time*) menyaring dan hanya menampilkan reservasi berstatus "Selesai". | [ ] Pass |
| ADM-03 | Cetak Laporan PDF | 1. Buka menu Reservasi <br> 2. Klik tombol "Cetak Laporan" | Muncul jendela Print Preview bawaan OS. Layout tampil bersih: latar putih, *sidebar* hitam hilang, teks berwarna hitam. | [ ] Pass |
| ADM-04 | Edit Harga Lapangan (Settings) | 1. Buka menu Pengaturan <br> 2. Ubah harga Futsal A menjadi 200.000 <br> 3. Simpan | Harga di database berubah. Saat pengguna melakukan *booking*, harga baru diterapkan. | [ ] Pass |
| ADM-04b | Edit Info Kontak (Settings) | 1. Buka menu Pengaturan <br> 2. Ubah alamat/telepon/email <br> 3. Simpan lalu cek Halaman Utama | Informasi kontak di _database_ diperbarui. Saat mengunjungi bagian Kontak di _Landing Page_, info yang baru langsung tertera. | [ ] Pass |
| ADM-05 | Laporan Keuangan | 1. Buka Dasbor Admin <br> 2. Cek Total Pendapatan | Sistem menampilkan agregasi pendapatan Harian dan Bulanan. | [ ] Pass |
| ADM-06 | LTV Pelanggan (CRUD) | 1. Buka menu Data Pelanggan <br> 2. Klik ikon detail pelanggan | Modal akan menampilkan rincian total booking dan Total Uang Dihabiskan (LTV). | [ ] Pass |
| ADM-07 | Notifikasi Real-time | 1. Pesan lapangan sebagai pelanggan <br> 2. Di layar Admin, tunggu 30 detik | Ikon lonceng otomatis memunculkan angka merah, klik untuk melihat rincian pemesanan tertunda. | [ ] Pass |
