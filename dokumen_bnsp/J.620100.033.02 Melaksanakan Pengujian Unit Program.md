# Hasil Pengujian Unit Program

**Sistem Reservasi SM Sport Center**
**Unit Kompetensi:** J.620100.033.02 Melaksanakan Pengujian Unit Program

| Keterangan | Detail |
|---|---|
| **Skema Sertifikasi (KKNI/Okupasi/Klaster)** | Analis Program |
| **Nomor** | SKM-2019-62010-002 |
| **TUK** | Sewaktu/Tempat Kerja/Mandiri** |
| **Nama Asesor** | Irmawati Carolina |
| **Nama Asesi** | Surya Daffa Fauzi Khoerudin |

---

## 1. Matriks Pengujian Unit Program (Unit Testing)

Pengujian ini menggunakan metode *Black-Box Testing* (Equivalence Partitioning & Boundary Value Analysis) untuk menguji setiap modul fungsionalitas aplikasi secara terisolasi tanpa perlu melihat *source code* di baliknya.

| No | Modul yang Diuji | Skenario Uji | Hasil yang Diharapkan | Hasil Aktual | Status |
|:---:|:---|:---|:---|:---|:---:|
| 1 | **Modul Autentikasi** | Memasukkan *email* dan *password* yang belum terdaftar di *database*. | Sistem menolak *login*, dan memunculkan *alert* warna merah "Email atau password salah". | Sesuai Harapan | **PASS** ✔️ |
| 2 | **Modul Autentikasi** | Melakukan *login* menggunakan *email* admin: `admin@smsport.com` | *Login* sukses, menu navigasi "Admin Panel" muncul secara dinamis di Navbar. | Sesuai Harapan | **PASS** ✔️ |
| 3 | **Modul Proteksi *Route*** | Mengakses URL `/admin` secara paksa namun status belum *login*. | Sistem menolak akses masuk dan otomatis mengembalikan (*redirect*) pengguna ke Halaman Utama. | Sesuai Harapan | **PASS** ✔️ |
| 4 | **Modul Pemesanan (Normal)** | Membuat reservasi lapangan Futsal di tanggal bebas pada jam 09:00 - 11:00. | Data sukses tersimpan di *database* PostgreSQL dan status berubah menjadi "Menunggu Pembayaran". | Sesuai Harapan | **PASS** ✔️ |
| 5 | **Modul Pemesanan (Bentrok)**| Membuat reservasi pada lapangan dan hari yang sama persis di jam 10:00 - 12:00. | Sistem menolak proses *submit*, mengeluarkan pesan *error* "Jadwal Bentrok". *Database* tidak mengeksekusi `INSERT`. | Sesuai Harapan | **PASS** ✔️ |
| 6 | **Modul Auto-Cancel**| Menunggu selama 20 menit tanpa membayar Uang Muka (DP). | Sistem membatalkan pesanan secara otomatis dan jadwal lapangan kembali tersedia. | Sesuai Harapan | **PASS** ✔️ |
| 7 | **Modul CRUD Pelanggan**| Admin menambahkan, mengedit, dan melihat riwayat data pelanggan. | Data sukses tersimpan dan tabel merespons perubahan seketika secara *real-time*. | Sesuai Harapan | **PASS** ✔️ |
